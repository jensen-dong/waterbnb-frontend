import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Bookings from "./components/Bookings/Bookings";
import BookingForm from "./components/Bookings/BookingForm";
import BookingDetail from "./components/Bookings/BookingDetails";
import EditReviewForm from "./components/Review/EditReviewForm";
import EditBookingForm from "./components/Bookings/EditBookingForm";
import Error404 from "./components/404/404";
import Footer from "./components/Footer/Footer";
import Landing from "./components/Landing/Landing";
import Listings from "./components/Listings/Listings";
import ListingDetail from "./components/Listings/ListingDetail";
import ManageListing from "./components/Profile/ManageListing";
import NavBar from "./components/NavBar/NavBar";
import NewListing from "./components/Profile/NewListing";
import Profile from "./components/Profile/Profile";
import Reviews from "./components/Review/Reviews";
import ReviewForm from "./components/Review/ReviewForm";
import SearchResults from "./components/Search/SearchResults";
import SigninForm from "./components/SigninForm/SigninForm";
import SignupForm from "./components/SignupForm/SignupForm";
import * as authService from "../src/services/authService";
import * as bnbService from "../src/services/bnbService";
import "./App.css"

const App = () => {
    const [user, setUser] = useState(authService.getUser());
    const [listings, setListings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState({});

    const handleSignout = () => {
        authService.signout();
        setUser(null);
    };

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const allListings = await bnbService.getAllListings();
                setListings(allListings);
            } catch (err) {
                console.log(err);
            }
        };
        fetchListings();
    }, []);

    useEffect(() => {
        const fetchListingAndReviews = async () => {
            try {
                const allListings = await bnbService.getAllListings();
                setListings(allListings);

                const reviewsMap = {};

                for (const listing of allListings) {
                    const reviews = await bnbService.getReviewsByListingId(listing._id);
                    reviewsMap[listing._id] = reviews;
                }
                setReviews(reviewsMap);
            } catch (error) {
                console.log(error);
            }
        };
        fetchListingAndReviews();
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const getAllBookings = await bnbService.getAllBookings();
                console.log("booking", getAllBookings);
                setBookings(getAllBookings);
            } catch (error) {
                console.log("error", error);
            }
        };
        fetchBookings();
    }, []);

    const addBooking = (newBooking) => {
        setBookings((prevBookings) => [...prevBookings, newBooking]);
    };

    const fetchAndUpdateReviews = async (listingId) => {
        try {
            const updatedReviews = await bnbService.getReviewsByListingId(listingId);
            console.log("Fetched reviews:", updatedReviews);
            setReviews((prevReviews) => ({
                ...prevReviews,
                [listingId]: updatedReviews,
            }));
        } catch (error) {
            console.log("Error fetching reviews", error);
        }
    };

    const updateListing = async () => {
        try {
            const updatedListing = await bnbService.getAllListings();
            setListings(updatedListing);
        } catch (error) {
            console.log("error", error);
        }
    };

    const updateBookings = async () => {
        try {
            const updateBooking = await bnbService.getAllBookings();
            setBookings(updateBooking);
        } catch (error) {
            console.log("error", error);
        }
    };
    return (
        <>
            <NavBar user={user} handleSignout={handleSignout} />
            <Routes>
                <Route path="/" element={<Landing listings={listings} />} />
                <Route path="/listings" element={<Listings listings={listings} />} />
                <Route path="/listings/:id" element={<ListingDetail />} />
                <Route path="/signup" element={<SignupForm setUser={setUser} />} />
                <Route path="/signin" element={<SigninForm setUser={setUser} />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="*" element={<Error404 />} /> {/* Catch-all route for 404 */}
                {user && (
                    <>
                        <Route path="/profile" element={<Profile setUser={setUser} />} />
                        <Route
                            path="/mybookings"
                            element={
                                <Bookings
                                    bookings={bookings}
                                    setBookings={setBookings}
                                    updateListing={updateListing}
                                />
                            }
                        />
                        <Route
                            path="/mybookings/new/:listingId"
                            element={<BookingForm addBooking={addBooking} />}
                        />
                        <Route path="/bookings/:id" element={<BookingDetail />} />
                        <Route
                            path="/bookings/edit/:id"
                            element={<EditBookingForm updateBookings={updateBookings} />}
                        />
                        <Route
                            path="/reviews/new/:listingId"
                            element={<ReviewForm fetchAndUpdateReviews={fetchAndUpdateReviews} />}
                        />
                        <Route path="/reviews/find/:id" element={<Reviews reviews={reviews} />} />
                        <Route path="/reviews/edit/:id" element={<EditReviewForm />} />

                        {user.isHost && (
                            <>
                                <Route
                                    path="/mylistings"
                                    element={
                                        <Listings
                                            listings={listings.filter(
                                                (listing) =>
                                                    listing.owner && listing.owner._id === user._id
                                            )}
                                        />
                                    }
                                />
                                <Route path="/listings/manage/:id" element={<ManageListing />} />
                                <Route path="/listings/new" element={<NewListing />} />
                            </>
                        )}
                    </>
                )}
            </Routes>
            <Footer />
        </>
    );
};

export default App;
