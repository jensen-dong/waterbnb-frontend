import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
// import Dashboard from "./components/Dashboard/Dashboard";
import SignupForm from "./components/SignupForm/SignupForm";
import SigninForm from "./components/SigninForm/SigninForm";
import Profile from "./components/Profile/Profile";
import Listings from "./components/Listings/Listings";
import ListingDetail from "./components/Listings/ListingDetail";
import Bookings from "./components/Bookings/Bookings";
import BookingForm from "./components/Bookings/BookingForm";
import BookingDetail from "./components/Bookings/BookingDetais";
import * as authService from "../src/services/authService";
import * as bnbService from "../src/services/bnbService";
import ReviewForm from "./components/Review/ReviewForm";
import Reviews from "./components/Review/Reviews"

const App = () => {
    const [user, setUser] = useState(authService.getUser());
    const [listings, setListings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState({});
     console.log("reviews", reviews)

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
  //   useEffect(() => {
  //     const fetchListings = async () => {
  //         try {
  //             const allListings = await bnbService.getAllListings();
  //             setListings(allListings);

  //             // Fetch reviews for each listing
  //             const reviewsPromises = allListings.map(listing => 
  //                 bnbService.getReviewsByListingId(listing._id)
  //             );

  //             const reviewsArray = await Promise.all(reviewsPromises);
  //             const reviewsMap = allListings.reduce((acc, listing, index) => {
  //                 acc[listing._id] = reviewsArray[index];
  //                 return acc;
  //             }, {});

  //             setReviews(reviewsMap);

  //         } catch (err) {
  //             console.log(err);
  //         }
  //     };
  //     fetchListings();
  // }, []);

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
        console.log("Fetched reviews:", updatedReviews); // Log to verify data
        setReviews(prevReviews => ({
            ...prevReviews,
            [listingId]: updatedReviews 
        }));
    } catch (error) {
        console.log("Error fetching reviews", error);
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
                {user && (
                    <>
                        <Route path="/profile" element={<Profile setUser={setUser} />} />
                        <Route path="/mybookings" element={<Bookings bookings={bookings} />} />
                        <Route
                            path="/mybookings/new/:listingId"
                            element={<BookingForm addBooking={addBooking} />}
                        />
                        <Route path="/bookings/:id" element={ <BookingDetail />}/>
                        <Route path="/reviews/new/:listingId" element={ <ReviewForm fetchAndUpdateReviews={fetchAndUpdateReviews}/>}/>
                        <Route path="/reviews/find/:id" element={ < Reviews reviews={reviews} />}/>
                        {user.isHost && (
                            <>
                                <Route path="/mylistings" /*element= ListingList.jsx */ />
                                <Route path="/listings/new" /*element= ListingForm.jsx */ />
                            </>
                        )}
                    </>
                )}
            </Routes>
        </>
    );
};

export default App;
