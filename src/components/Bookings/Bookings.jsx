import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as bnbService from "../../services/bnbService";
import "./Bookings.css";

const Bookings = (props) => {
    const [randomImages, setRandomImages] = useState([]);
    const [bookingImages, setBookingImages] = useState({});
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(dateString);
        const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        return adjustedDate.toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        const fetchImages = async () => {
            const images = await bnbService.apiImages();
            setRandomImages(images);
        };
        fetchImages();
    }, []);

    useEffect(() => {
        if (randomImages.length > 0 && props.bookings.length > 0) {
            const newBookingImages = {};
            const availableImages = [...randomImages];

            props.bookings.forEach((booking) => {
                const randomIndex = Math.floor(Math.random() * availableImages.length);
                newBookingImages[booking._id] = availableImages.splice(randomIndex, 1)[0];
            });

            setBookingImages(newBookingImages);
        }
    }, [randomImages, props.bookings]);

    const handleDelete = async (bookingId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this booking?");
        if (!isConfirmed) return;
        try {
            await bnbService.deleteBooking(bookingId);
            const updateBookings = props.bookings.filter((booking) => booking._id !== bookingId);
            props.setBookings(updateBookings);
            props.updateListing();
            navigate("/");
        } catch (error) {
            console.log("error", error);
        }
    };

    return (
        <main>
            <h1 className="your-bookings">Your Bookings</h1>
            <div className="bookings-container">
                {props.bookings.length ? (
                    props.bookings.map((booking) => (
                        <div className="booking-card" key={booking._id}>
                            <img src={bookingImages[booking._id]} alt={booking.listing.title} />
                            <div className="booking-overlay">
                                <div className="top-left">
                                    <h1 className="booking-title">{booking.name}</h1>
                                </div>
                                <div className="bottom-left">
                                    <p>
                                        {formatDate(booking.startDate)} to{" "}
                                        {formatDate(booking.endDate)}
                                    </p>
                                </div>
                                <div className="top-right">
                                    <Link to={`/bookings/${booking._id}`} className="btn btn1">
                                        Details
                                    </Link>
                                    <Link
                                        to={`/listings/${booking.listing._id}`}
                                        className="btn btn1"
                                    >
                                        Listing
                                    </Link>
                                </div>
                                <div className="bottom">
                                    <button
                                        className="btn btnDel"
                                        onClick={() => handleDelete(booking._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You haven't booked anything yet!</p>
                )}
            </div>
        </main>
    );
};

export default Bookings;
