import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../AuthContext';
import firebase from '../firebase';
import BadgeIcon from '@mui/icons-material/Badge';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
const classLevels = [
  '1.0-1.5 Анхан',
  '1.5-2.5 Анхан-дунд',
  '2.0-2.5 Дунд',
  '≥ 2.5 Ахисан'
];

function TennisCourtBooking() {
  const [isMobile, setIsMobile] = useState(false);
  const [showImages, setShowImages] = useState(true);
  const tableContainerRef = useRef(null);
  const { currentUser, handleSignInOrRegister, signOut, getCoachData } =
    useAuth();
  const [isCoachLoggedIn, setIsCoachLoggedIn] = useState(false);
  const [coachData, setCoachData] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [date, setDate] = useState(new Date());
  const [courts, setCourts] = useState([]);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [openClassBookingFormOpen, setOpenClassBookingFormOpen] =
    useState(false);
  const [openClassFee, setOpenClassFee] = useState(0);
  const [availableSlot, setAvailableSlot] = useState(8);
  const [openClass4Coach, setOpenClass4Coach] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedEndSlot, setSelectedEndSlot] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [bookings, setBookings] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeData, setQRCodeData] = useState(null);
  const [qPayMobileBankData, setQPayMobileBankData] = useState(null);
  const [showQRCodePage, setShowQRCodePage] = useState(false);
  const [openClassBookingMade, setOpenClassBookingMade] = useState(false);
  const [showPaymentCompleteWarning, setShowPaymentCompleteWarning] =
    useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [showBankList, setShowBankList] = useState(false);

  const [bookingInfo, setBookingInfo] = useState({
    name: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phoneNumber: ''
  });
  const [bookingMade, setBookingMade] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [qrCreated, setQrCreated] = useState(false);
  const [classLevel, setClassLevel] = useState('');
  const [openClassIntroOpen, setOpenClassIntroOpen] = useState(false);
  const [openClassData, setOpenClassData] = useState(null);
  const [disableDiscardBtn, setDisableDiscardBtn] = useState(false);
  const glowingStyle = {
    boxShadow: '0 0 8px 2px white',
    transition: 'box-shadow 0.5s ease-in-out'
  };

  const hours = [];
  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  const [classFull, setClassFull] = useState(false);

  const isToday = date => {
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

  for (let hour = isToday(date) ? currentHour : 6; hour <= 21; hour++) {
    hours.push(`${hour < 10 ? '0' + hour : hour}:00`);
    hours.push(`${hour < 10 ? '0' + hour : hour}:30`);
  }

  useEffect(() => {
    // Check if the screen width is less than or equal to 600px (mobile view)
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 600;
      setIsMobile(isMobileView);
      setImageHeight(isMobileView ? '70px' : '100px');
    };

    // Set initial state
    handleResize();

    // Add event listener for screen resize
    window.addEventListener('resize', handleResize);
    const interval = setInterval(() => {
      checkPayment();
    }, 5000);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [showQRCodePage, bookingSubmitted]);

  useEffect(() => {
    const fetchCoaches = async () => {
      const snapshot = await firebase.firestore().collection('coaches').get();
      const coachesData = snapshot.docs.map(doc => {
        const coach = doc.data();
        return {
          id: doc.id,
          firstName: coach.firstName,
          lastName: coach.lastName,
          color: coach.color,
          photoURL: coach.photoURL
        };
      });

      if (coachData) {
        setCoaches([
          ...coachesData.filter(coach => coach.id !== coachData.id),
          coachesData.find(coach => coach.id === coachData.id)
        ]);
      } else {
        setCoaches(coachesData);
      }
    };

    fetchCoaches();
  }, [coachData]);

  useEffect(() => {
    const checkCoachLogin = async () => {
      if (currentUser) {
        const coachData = await getCoachData(currentUser.email);

        console.log(coachData, ' coachData');

        if (coachData) {
          setIsCoachLoggedIn(true);
          setCoachData(coachData);
          localStorage.setItem('coachData', JSON.stringify(coachData));
        } else {
          setIsCoachLoggedIn(false);
          setCoachData(null);
          localStorage.removeItem('coachData');
        }
      } else {
        setIsCoachLoggedIn(false);
        setCoachData(null);
        localStorage.removeItem('coachData');
      }
    };

    checkCoachLogin();
  }, [currentUser, getCoachData]);

  useEffect(() => {
    const storedCoachData = localStorage.getItem('coachData');
    if (storedCoachData) {
      setCoachData(JSON.parse(storedCoachData));
    }
  }, []);

  useEffect(() => {
    const fetchCourts = async () => {
      setIsLoading(true);

      const snapshot = await firebase.firestore().collection('courts').get();
      const courtData = snapshot.docs.map(doc => {
        const court = doc.data();
        const selectedDate = formatDate(date);
        const bookedSlots =
          court.bookings && court.bookings[selectedDate]
            ? Object.entries(court.bookings[selectedDate])
                .filter(([hour, booked]) => booked)
                .map(([hour]) => hour)
            : [];
        return { ...court, bookedSlots };
      });
      setCourts(courtData);

      const bookingSnapshot = await firebase
        .firestore()
        .collection('bookings')
        .doc(formatDate(date))
        .get();
      const bookingData = bookingSnapshot.exists ? bookingSnapshot.data() : {};
      setBookings(bookingData);

      setIsLoading(false);
    };

    fetchCourts();
  }, [date, bookingMade]);

  useEffect(() => {
    const handleReloadOnQrPage = event => {
      event.preventDefault();
      localStorage.setItem('isPageReloaded', 'true');
    };
    window.addEventListener('beforeunload', handleReloadOnQrPage);

    return () => {
      window.removeEventListener('beforeunload', handleReloadOnQrPage);
    };
  }, []);

  const checkPayment = async () => {
    if (!bookingMade && showQRCodePage) await handleCheckPayment();
  };

  const handleCheckPayment = async () => {
    try {
      setLoading(true);
      setShowPaymentCompleteWarning(false);
      const response = await fetch(process.env.REACT_APP_QPAY_CHECK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invoice_id: qrCodeData.invoice_id })
      });

      const data = await response.json();

      const { count, paid_amount, rows, invoice_status } = data.resp;

      if (count > 0 && rows.every(row => row.payment_status === 'PAID')) {
        const db = firebase.firestore();
        const bookingDateStr = formatDate(selectedSlot);
        const bookingRef = db.collection('bookings').doc(bookingDateStr);
        const startTime = formatTime(selectedSlot);
        const endTime = formatTime(selectedEndSlot);
        const bookingKey = `${startTime}-${endTime}`;

        const booking = await findBookingDetails(selectedCourt, bookingKey);

        // // open class logic
        // await bookingRef.update({
        //   [`${selectedCourt}.${bookingKey}.payment.status`]: 'paid',
        //   [`${selectedCourt}.${bookingKey}.bookingStatus`]: 'booked'
        // });

        setShowQRCodePage(false);
        setShowBookingConfirmation(true);
        setBookingMade(true);
        setDisableDiscardBtn(false);
        setLoading(false);
        setBookingSubmitted(false);
        setOpenClassBookingFormOpen(false);

        if (
          openClassBookingFormOpen &&
          !bookingMade &&
          !showBookingConfirmation
        ) {
          const newClassAttendants = booking.classAttendants || [];
          const newClassAttendants4Coach = booking.classAttendants4Coach || [];

          newClassAttendants.push(bookingInfo.name);

          newClassAttendants4Coach.push(
            bookingInfo.name + ' ' + bookingInfo.phoneNumber
          );

          const availableSlot = booking.availableSlot;
          const decreasedSlot = availableSlot - 1;

          const uniqueArr = [...new Set(newClassAttendants)];
          const uniqueArr4Coach = [...new Set(newClassAttendants4Coach)];

          await bookingRef.update({
            [`${selectedCourt}.${bookingKey}.payment.status`]: 'paid',
            [`${selectedCourt}.${bookingKey}.bookingStatus`]: 'booked',
            [`${selectedCourt}.${bookingKey}.availableSlot`]: decreasedSlot,
            [`${selectedCourt}.${bookingKey}.classAttendants`]: uniqueArr,
            [`${selectedCourt}.${bookingKey}.classAttendants4Coach`]:
              uniqueArr4Coach
          });

          return;
        }

        // regular court booking
        await bookingRef.update({
          [`${selectedCourt}.${bookingKey}.payment.status`]: 'paid',
          [`${selectedCourt}.${bookingKey}.bookingStatus`]: 'booked'
        });
      } else {
        setShowPaymentCompleteWarning(true);
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment check failed:', error);
      setShowPaymentCompleteWarning(true);
      setLoading(false);
    }
  };

  const OpenClassBookingForm = () => {
    return <Dialog open={openClassBookingFormOpen}></Dialog>;
  };

  const onOpenClassIntroSubmit = async () => {
    const startTime = formatTime(selectedSlot);
    const endTime = formatTime(selectedEndSlot);
    const bookingKey = `${startTime}-${endTime}`;

    const bookingData = await findBookingDetails(selectedCourt, bookingKey);
    setOpenClassData(bookingData);
    if (bookingData?.availableSlot <= 0) {
      setClassFull(true);
      return;
    }

    setOpenClassData(bookingData);
    setOpenClassIntroOpen(false);
    setBookingFormOpen(true);
  };

  const OpenClassIntro = () => {
    return (
      <Dialog
        open={openClassIntroOpen}
        onClose={() => {
          setOpenClassIntroOpen(false);
          setOpenClassBookingFormOpen(false);
        }}
        maxWidth='sm'
        fullWidth={true}
        style={{ padding: '10px', backdropFilter: 'blur(5px)' }}>
        <DialogTitle
          textAlign={'center'}
          style={{ background: '#86a27b', color: 'white' }}>
          {openClassData?.classLevel}
        </DialogTitle>
        <DialogContent
          style={{ background: '#86a27b', color: 'white', padding: '1em' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
            {/* <img
              src='/tennisMotion1.png'
              alt='player'
              width={100}
              height={70}
              style={{ objectFit: 'cover', objectPosition: '70% 0' }}
            />
            <img
              src='/tennisMotion2.png'
              alt='player2'
              width={100}
              height={70}
              style={{ objectFit: 'cover', objectPosition: '100% 0' }}
            /> */}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1em'
            }}>
            <div>Дасгалжуулагч:</div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
              <BadgeIcon sx={{ fontSize: '50px' }} />
              <div>{openClassData?.name}</div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'start'
            }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                alignItems: 'end'
              }}>
              <div>Бүртгүүлсэн:</div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                alignItems: 'end',
                marginRight: '2em'
              }}>
              <br />
              {openClassData?.classAttendants?.map(c => <div>{c}</div>)}
              {renderOpenSlots()}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
            {classFull
              ? 'Анги дүүрсэн'
              : `Сул зай: ${openClassData?.availableSlot}`}
          </div>
        </DialogContent>
        <DialogActions
          style={{
            backgroundColor: '#86a27b',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '0.3em',
            padding: '1em'
          }}>
          <Button
            onClick={() => setOpenClassIntroOpen(false)}
            variant='contained'
            style={{
              backgroundColor: 'white',
              color: '#86a27b'
            }}>
            Хаах
          </Button>
          {!classFull && (
            <Button
              onClick={onOpenClassIntroSubmit}
              variant='contained'
              style={{ backgroundColor: openClassData?.color, color: 'white' }}>
              Захиалах
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  const renderOpenSlots = () => {
    const arr = [];

    const availableSlotNum = 8 - (openClassData?.classAttendants?.length || 0);
    for (let k = 0; k < availableSlotNum; k++) {
      arr.push('-');
    }

    return (
      <>
        {arr.map(a => (
          <div key={a} style={{ textAlign: 'left' }}>
            {a}
          </div>
        ))}
      </>
    );
  };
  const BankListOverlay = ({ bankData, onClose }) => {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
            {bankData.map((bank, index) => (
              <div
                key={index}
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  width: '33.33%'
                  // boxSizing: 'border-box'
                }}>
                <a href={bank.link} target='_blank' rel='noopener noreferrer'>
                  <img
                    src={bank.logo}
                    alt={bank.name}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '15px'
                    }}
                  />
                </a>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              onClick={onClose}
              variant='contained'
              style={{ backgroundColor: '#3554A4' }}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const removeBookingSlot = () => {
    const bookingDateStr = formatDate(selectedSlot);
    const startTime = formatTime(selectedSlot);
    const endTime = formatTime(selectedEndSlot);
    const bookingKey = `${startTime}-${endTime}`;

    const db = firebase.firestore();
    const bookingRef = db.collection('bookings').doc(bookingDateStr);
    const courtRef = db.collection('courts').doc(selectedCourt);

    db.runTransaction(transaction => {
      return transaction.get(bookingRef).then(bookingDoc => {
        if (bookingDoc.exists) {
          const bookingData = bookingDoc.data();
          const courtBooking = bookingData[selectedCourt];

          if (
            courtBooking &&
            courtBooking[bookingKey] &&
            courtBooking[bookingKey].bookingStatus === 'pending'
          ) {
            // Read the court document
            return transaction.get(courtRef).then(courtDoc => {
              if (courtDoc.exists) {
                const courtData = courtDoc.data();
                const bookings = courtData.bookings || {};
                const dailyBookings = bookings[bookingDateStr] || {};

                const updatedDailyBookings = { ...dailyBookings };

                // Iterate over the time slots between start and end time
                let currentTime = new Date(selectedSlot);
                while (currentTime < selectedEndSlot) {
                  const timeKey = formatTime(currentTime);
                  delete updatedDailyBookings[timeKey];
                  currentTime.setMinutes(currentTime.getMinutes() + 30);
                }

                const updatedBookings = {
                  ...bookings,
                  [bookingDateStr]: updatedDailyBookings
                };

                // Delete the temporary booking data from the bookings collection
                const updatedCourtBooking = { ...courtBooking };
                delete updatedCourtBooking[bookingKey];

                // Perform the writes
                transaction.update(bookingRef, {
                  [selectedCourt]: updatedCourtBooking
                });
                transaction.update(courtRef, { bookings: updatedBookings });
              }
            });
          }
        }
      });
    })
      .then(() => {
        console.log(
          'Temporary booking data and hourly slot fields deleted successfully.'
        );
        setShowQRCodePage(false);
        setQRCodeData(null);
        handleCloseBookingForm();
      })
      .catch(error => {
        console.error(
          'Error deleting temporary booking data and hourly slot fields:',
          error
        );
      });
  };

  const handleCloseQRCodePage = () => {
    if (
      window.confirm('Та энэ захиалгыг цуцлах гэж байгаадаа итгэлтэй байна уу?')
    ) {
      const bookingDateStr = formatDate(selectedSlot);
      const startTime = formatTime(selectedSlot);
      const endTime = formatTime(selectedEndSlot);
      const bookingKey = `${startTime}-${endTime}`;

      const db = firebase.firestore();
      const bookingRef = db.collection('bookings').doc(bookingDateStr);
      const courtRef = db.collection('courts').doc(selectedCourt);

      db.runTransaction(transaction => {
        return transaction.get(bookingRef).then(bookingDoc => {
          if (bookingDoc.exists) {
            const bookingData = bookingDoc.data();
            const courtBooking = bookingData[selectedCourt];

            if (
              courtBooking &&
              courtBooking[bookingKey] &&
              courtBooking[bookingKey].bookingStatus === 'pending'
            ) {
              // Read the court document
              return transaction.get(courtRef).then(courtDoc => {
                if (courtDoc.exists) {
                  const courtData = courtDoc.data();
                  const bookings = courtData.bookings || {};
                  const dailyBookings = bookings[bookingDateStr] || {};

                  const updatedDailyBookings = { ...dailyBookings };

                  // Iterate over the time slots between start and end time
                  let currentTime = new Date(selectedSlot);
                  while (currentTime < selectedEndSlot) {
                    const timeKey = formatTime(currentTime);
                    delete updatedDailyBookings[timeKey];
                    currentTime.setMinutes(currentTime.getMinutes() + 30);
                  }

                  const updatedBookings = {
                    ...bookings,
                    [bookingDateStr]: updatedDailyBookings
                  };

                  // Delete the temporary booking data from the bookings collection
                  const updatedCourtBooking = { ...courtBooking };
                  const openClass = courtBooking[bookingKey].isOpenClass;

                  if (!openClass) {
                    delete updatedCourtBooking[bookingKey];
                  }

                  // Perform the writes
                  transaction.update(bookingRef, {
                    [selectedCourt]: updatedCourtBooking
                  });
                  transaction.update(courtRef, { bookings: updatedBookings });
                }
              });
            }
          }
        });
      })
        .then(() => {
          console.log(
            'Temporary booking data and hourly slot fields deleted successfully.'
          );
          setShowQRCodePage(false);
          setQRCodeData(null);
          handleCloseBookingForm();
        })
        .catch(error => {
          console.error(
            'Error deleting temporary booking data and hourly slot fields:',
            error
          );
        });
    }

    setQrCreated(false);
  };

  const BookingConfirmation = () => {
    const bookingDuration = Math.abs(selectedEndSlot - selectedSlot) / 36e5;

    const handleCloseConfirmation = () => {
      setShowBookingConfirmation(false);
      handleCloseBookingForm();
    };

    return (
      <div>
        <DialogTitle
          style={{
            backgroundColor: '#334eac',
            color: 'white',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
          Захиалга Баталгаажуулалт
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
            <img
              src={selectedCourtObject?.pictureUrl}
              alt='Tennis Court'
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                marginRight: '16px'
              }}
            />
            <Typography variant='h6'>{selectedCourtObject?.name}</Typography>
          </div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Өдөр</TableCell>
                <TableCell>
                  {selectedSlot.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                  })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Цаг</TableCell>
                <TableCell>
                  {formatTime(selectedSlot)} - {formatTime(selectedEndSlot)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Үргэлжлэх хугацаа</TableCell>
                <TableCell>{bookingDuration} цаг</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Нэр</TableCell>
                <TableCell>
                  {isCoachLoggedIn
                    ? `${coachData.firstName} ${coachData.lastName}`
                    : bookingInfo.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Холбогдох утас</TableCell>
                <TableCell>
                  {isCoachLoggedIn ? coachData.phone : bookingInfo.phoneNumber}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>⚠️ Анхаарах зүйл</TableCell>
                <TableCell>
                  Захиалга хийгдсэн тохиолдолд, цуцлах боломжгүй гэдгийг
                  анхаарна уу. Тиймээс буцаан олголт хийгдэхгүй болно.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant='contained'
            style={{ backgroundColor: '#3554A4' }}>
            Хаах
          </Button>
        </DialogActions>
      </div>
    );
  };

  const fetchData = async () => {
    setIsLoading(true);

    const snapshot = await firebase.firestore().collection('courts').get();
    const courtData = snapshot.docs.map(doc => {
      const court = doc.data();
      const selectedDate = formatDate(date);
      const bookedSlots =
        court.bookings && court.bookings[selectedDate]
          ? Object.entries(court.bookings[selectedDate])
              .filter(([hour, booked]) => booked)
              .map(([hour]) => hour)
          : [];
      return { ...court, bookedSlots };
    });
    setCourts(courtData);

    const bookingSnapshot = await firebase
      .firestore()
      .collection('bookings')
      .doc(formatDate(date))
      .get();
    const bookingData = bookingSnapshot.exists ? bookingSnapshot.data() : {};
    setBookings(bookingData);

    setIsLoading(false);
    setBookingMade(false);
  };

  const [imageHeight, setImageHeight] = useState('auto');
  const [profileHeight, setProfileHeight] = useState('auto');

  const handleTableScroll = useCallback(
    event => {
      const tableContainer = event.currentTarget;
      const scrollPosition = tableContainer.scrollTop;

      if (scrollPosition > 0) {
        setShowImages(false);
        // setImageHeight('0px');
        setProfileHeight('0px');
      } else {
        setShowImages(true);
        setImageHeight(isMobile ? '70px' : '100px');
        setProfileHeight(isMobile ? '150px' : '200px');
      }
    },
    [isMobile]
  );

  const getBookingDetails = (courtId, slot) => {
    if (!bookings[courtId]) {
      return null;
    }

    for (const [key, value] of Object.entries(bookings[courtId])) {
      const [startTime, endTime] = key.split('-');
      const startSlot = new Date(date);
      const [startHour, startMinute] = startTime.split(':').map(Number);
      startSlot.setHours(startHour, startMinute, 0, 0);

      const endSlot = new Date(date);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      endSlot.setHours(endHour, endMinute, 0, 0);

      if (slot >= startSlot && slot < endSlot) {
        return value;
      }
    }

    return null;
  };

  const findBookingDetails = async (courtId, bookingKey) => {
    const db = firebase.firestore();
    const bookingDateStr = formatDate(date);
    const bookingRef = db.collection('bookings').doc(bookingDateStr);
    const bookingss = (await bookingRef.get())?.data();

    // const slot = new Date(date);
    // const startTimeKey = formatTimeKey(
    //   startTime.getHours(),
    //   startTime.getMinutes()
    // );
    // const endTimeKey = formatTimeKey(endTime.getHours(), endTime.getMinutes());

    // const bookingKey = `${startTimeKey}-${endTimeKey}`;

    return bookingss[courtId][bookingKey];
  };

  const handleOpenClassBooking = async (
    courtId,
    startTime,
    endTime,
    classFee,
    classDatas
  ) => {
    setBookingInfo({
      name: '',
      phoneNumber: ''
    });

    setSelectedCourt(courtId);
    setSelectedSlot(startTime);
    setSelectedEndSlot(endTime);

    const startTimeFormatted = formatTime(startTime);
    const endTimeFormatted = formatTime(endTime);
    const bookingKey = `${startTimeFormatted}-${endTimeFormatted}`;

    const classData = await findBookingDetails(courtId, bookingKey);

    setOpenClassBookingFormOpen(true);
    setOpenClassFee(classFee);
    setOpenClassData(classData);

    if (classData?.availableSlot <= 0) {
      setClassFull(true);
      setOpenClassIntroOpen(true);
      return;
    }

    setClassFull(false);
    setOpenClassIntroOpen(true);
  };

  const handleBooking = (courtId, slot) => {
    const [selectedHour, selectedMinute] = slot.split(':').map(Number);
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(selectedHour, selectedMinute, 0, 0);
    setSelectedSlot(selectedDateTime);
    setSelectedCourt(courtId);
    setBookingFormOpen(true);
    setBookingInfo({
      name: '',
      phoneNumber: ''
    });
    if (isCoachLoggedIn) {
      setSelectedCoach(coachData.id);
    } else {
      setSelectedCoach(null);
    }
  };

  const selectedCourtObject = courts.find(court => court.id === selectedCourt);

  const isSlotOpenClass = (courtId, slot) => {
    const court = courts.find(court => court.id === courtId);
    return court && court.bookedSlots && court.openClasses.includes(slot);
  };

  const isSlotBooked = (courtId, slot) => {
    const court = courts.find(court => court.id === courtId);
    return court && court.bookedSlots && court.bookedSlots.includes(slot);
  };

  const formatDate = date => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePrevDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setBookingInfo({ ...bookingInfo, [name]: value });
  };

  const handleCloseBookingForm = (even, reason) => {
    if (reason && reason === 'backdropClick') return;

    setQrCreated(false);
    setBookingFormOpen(false);
    setSelectedSlot(null);
    setSelectedCourt(null);
    setSelectedEndSlot(null);
    setSelectedCoach(null);
    setErrors({
      name: '',
      phoneNumber: '',
      endSlot: ''
    });
    setBookings({}); // Reset the bookings state variable
    setLoading(false);

    if (isCoachLoggedIn) {
      setBookingMade(true);
      setDisableDiscardBtn(false);
    }
    setShowQRCodePage(null);
    setShowPaymentCompleteWarning(false);
    setOpenClassBookingFormOpen(false);
    fetchData(); // Call the fetchData function to reload the data and show the shimmer effect
  };

  const validateBookingInfo = (bookingInfo, isCoachLoggedIn) => {
    const errors = {};
    if (!isCoachLoggedIn) {
      if (!bookingInfo.name.trim()) {
        errors.name = 'Хоосон байна';
      }
      if (!bookingInfo.phoneNumber.trim()) {
        errors.phoneNumber = 'Хоосон байна';
      }
    }
    if (!selectedEndSlot) {
      errors.endSlot = 'Хоосон байна';
    }

    if (isCoachLoggedIn) {
      if (openClass4Coach) {
        if (!availableSlot) {
          errors.availableSlot = 'Хүний тоо хоосон байна';
        }

        console.log(openClassFee, ' pack');

        if (!openClassFee || openClassFee == 0) {
          errors.openClassFee = 'Төлбөр хоосон байна';
        }

        if (!classLevel) {
          errors.classLevel = 'Ангийн түвшин хоосон байна';
        }
      }
    }
    return errors;
  };

  const updateCourtBookings = async (
    db,
    courtRef,
    bookingDateStr,
    selectedSlot,
    selectedEndSlot
  ) => {
    await db.runTransaction(async transaction => {
      const courtDoc = await transaction.get(courtRef);
      if (!courtDoc.exists) {
        throw 'Document does not exist!';
      }
      const courtData = courtDoc.data();
      const bookings = courtData.bookings || {};
      const dailyBookings = bookings[bookingDateStr] || {};

      let currentTime = selectedSlot.getTime();
      while (currentTime < selectedEndSlot.getTime()) {
        const hour = new Date(currentTime).getHours();
        const minute = new Date(currentTime).getMinutes();
        const timeKey = formatTimeKey(hour, minute);
        dailyBookings[timeKey] = true;
        currentTime += 1800000;
      }

      bookings[bookingDateStr] = dailyBookings;
      transaction.update(courtRef, { bookings: bookings });
    });
  };

  const updateBookingData = async (
    db,
    bookingRef,
    bookingDateStr,
    selectedCourt,
    bookingKey,
    bookingData
  ) => {
    //only if booking data exists, modify doc on db
    if (bookingData) {
      await db.runTransaction(async transaction => {
        const bookingDoc = await transaction.get(bookingRef);
        let updatedBookingData = {
          [selectedCourt]: {
            [bookingKey]: {
              ...bookingData,
              payment: {
                ...bookingData.payment
              }
            }
          }
        };

        if (bookingDoc.exists) {
          const existingData = bookingDoc.data();
          if (existingData[selectedCourt]) {
            existingData[selectedCourt][bookingKey] = {
              ...bookingData,
              payment: {
                ...bookingData.payment
              }
            };
            updatedBookingData = existingData;
          }
        }

        transaction.set(bookingRef, updatedBookingData, { merge: true });
      });
    }
  };

  const handleBookingSubmit = async () => {
    const db = firebase.firestore();

    const bookingDateStr = formatDate(selectedSlot);
    const startTime = formatTime(selectedSlot);
    const endTime = formatTime(selectedEndSlot);
    const bookingKey = `${startTime}-${endTime}`;
    const fee = await calculateTotalFee(
      selectedSlot,
      selectedEndSlot,
      selectedCourtObject,
      false,
      openClassBookingFormOpen
    );

    console.log(isCoachLoggedIn, ' iscoachlogged');
    console.log(isCoachLoggedIn, ' iscoachlogged');

    const errors = validateBookingInfo(bookingInfo, isCoachLoggedIn);
    setErrors(errors);

    setQrCreated(true);

    console.log('jejje', errors);
    if (Object.keys(errors).length === 0) {
      console.log('kekeke');

      setDisableDiscardBtn(true);
      setLoading(true);
      setBookingSubmitted(true);
      try {
        const courtRef = db.collection('courts').doc(selectedCourt);
        await updateCourtBookings(
          db,
          courtRef,
          bookingDateStr,
          selectedSlot,
          selectedEndSlot
        );
        const bookingRef = db.collection('bookings').doc(bookingDateStr);

        let bookingData;

        if (selectedCoach) {
          const coach = coaches.find(
            c => c.id.toLowerCase() === selectedCoach.toLowerCase()
          );
          bookingData = {
            isCoach: true,
            name: `${coach.firstName} ${coach.lastName}`,
            color: coach.color,
            startTime: `${bookingDateStr} ${startTime}`,
            endTime: `${bookingDateStr} ${endTime}`,
            bookingStatus: 'booked',
            isOpenClass: openClass4Coach,
            classFee: parseInt(openClassFee, 10),
            classLevel,
            availableSlot: parseInt(availableSlot)
          };
        } else if (isCoachLoggedIn) {
          console.log('modifying');

          bookingData = {
            isCoach: true,
            name: `${coachData.firstName} ${coachData.lastName} (та өөрөө)`,
            color: coachData.color,
            phone: coachData.phone,
            startTime: `${bookingDateStr} ${startTime}`,
            endTime: `${bookingDateStr} ${endTime}`,
            bookingStatus: 'booked',
            isOpenClass: openClass4Coach,
            classFee: parseInt(openClassFee, 10),
            classLevel,
            availableSlot: parseInt(availableSlot)
          };
        } else {
          bookingData = {
            name: bookingInfo.name,
            phone: `+976${bookingInfo.phoneNumber}`,
            startTime: `${bookingDateStr} ${startTime}`,
            endTime: `${bookingDateStr} ${endTime}`,
            payment: {
              status: 'pending'
            },
            bookingStatus: 'pending'
          };
        }

        console.log(bookingData, ' bookingData');

        if (!openClassBookingFormOpen) {
          await updateBookingData(
            db,
            bookingRef,
            bookingDateStr,
            selectedCourt,
            bookingKey,
            bookingData
          );
        }

        if (bookingData.bookingStatus === 'booked' && isCoachLoggedIn) {
          setBookingMade(true);
          setDisableDiscardBtn(false);
          setLoading(false);
          handleCloseBookingForm();
        } else {
          const response = await fetch(process.env.REACT_APP_QPAY_INVOICE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              amount: parseInt(fee, 10),
              court: selectedCourt,
              bookingTime: `${bookingDateStr} ${startTime}-${endTime}`,
              phone: bookingInfo.phoneNumber
            })
          });

          const data = await response.json();
          const { qr_image, invoice_id, qr_text, urls } = data.response;

          setQPayMobileBankData(urls);

          if (!openClassBookingFormOpen) {
            await updateBookingData(
              db,
              bookingRef,
              bookingDateStr,
              selectedCourt,
              bookingKey,
              {
                ...bookingData,
                payment: {
                  ...bookingData.payment,
                  invoice_id,
                  qr_text,
                  qr_image,
                  urls
                }
              }
            );
          }

          setQRCodeData({ qr_image, invoice_id });
          setShowQRCodePage(true);
        }
      } catch (error) {
        console.error('Booking failed:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const generateAvailableEndSlots = () => {
    const availableSlots = [];
    let currentTime = selectedSlot.getTime();

    let nextBookingTime = getNextBookingTime(selectedCourt, selectedSlot);

    let maxDurationTime = nextBookingTime
      ? nextBookingTime
      : new Date(formatDate(date) + 'T22:00:00').getTime();

    currentTime += 30 * 60 * 1000;
    while (currentTime <= maxDurationTime) {
      const currentSlot = new Date(currentTime);
      if (!isSlotBooked(selectedCourt, formatTime(currentSlot))) {
        availableSlots.push(currentSlot);
      } else {
        // If the current slot is booked, include it as an available end slot
        availableSlots.push(currentSlot);
        break;
      }
      currentTime += 30 * 60 * 1000;
    }

    return availableSlots;
  };

  const formatTime = date => {
    if (date) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${hours < 10 ? '0' + hours : hours}:${
        minutes < 10 ? '0' + minutes : minutes
      }`;
    }
  };

  const formatTimeKey = (hour, minute) =>
    `${hour < 10 ? '0' + hour : hour}:${minute < 30 ? '00' : '30'}`;

  const getNextBookingTime = (courtId, startTime) => {
    const selectedDate = formatDate(startTime);
    const court = courts.find(court => court.id === courtId);
    if (court && court.bookings && court.bookings[selectedDate]) {
      const bookedHours = Object.keys(court.bookings[selectedDate]);
      for (let hour of bookedHours) {
        const [bookedHour, bookedMinute] = hour.split(':').map(Number);
        const bookingStartTime = new Date(startTime);
        bookingStartTime.setHours(bookedHour, bookedMinute, 0, 0);
        if (bookingStartTime.getTime() > startTime.getTime()) {
          return bookingStartTime.getTime();
        }
      }
    }
    return null;
  };

  const checkDiscountTimeIncluded = (
    selectedCourtObject,
    startTime,
    endTime
  ) => {};

  const calculateFeeForOpenClass = numberOnly => {
    const defaultPrice = 50000;
    const durationInMillis =
      selectedEndSlot?.getTime() - selectedSlot?.getTime() || 0;
    const durationInHours = durationInMillis / 3600000; // Convert milliseconds to hours
    const formattedInteger =
      (defaultPrice * durationInHours)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '₮';

    if (numberOnly) return (defaultPrice * durationInHours).toString();
    return formattedInteger;
  };

  const calculateTotalFee = (
    startSlot,
    endSlot,
    selectedCourtObject,
    kNotation,
    isOpenClass
  ) => {
    const hourlyFee = selectedCourtObject?.fee;

    if (!hourlyFee) return '';

    const durationInMillis = endSlot?.getTime() - startSlot?.getTime() || 0;
    const durationInHours = durationInMillis / 3600000; // Convert milliseconds to hours

    let fee = 0;
    if (hourlyFee.includes('K')) {
      fee = parseInt(hourlyFee.replace('K', ''), 10) * 1000; // Convert 'K' notation to actual fee
    } else {
      fee = parseInt(hourlyFee, 10);
    }

    if (isOpenClass) return openClassFee;

    const totalFee = Math.ceil(durationInHours * fee);

    if (kNotation) {
      return `${Math.floor(totalFee / 1000)}K`;
    } else {
      return totalFee;
    }
  };

  const LoadingPage = () => (
    <div sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
      <CircularProgress disableShrink color='success' />
    </div>
  );

  const ShimmerTable = () => (
    <TableContainer
      component={Paper}
      style={{
        backgroundColor: '#334EAC',
        borderLeft: '1em solid white',
        height: '90vh',
        overflow: 'auto'
      }}>
      {/* <Shimmer> */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ padding: '16px', width: '80px' }}>
              {/* <Breathing style={{ width: '40px', height: '16px' }} /> */}
            </TableCell>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableCell key={index} style={{ padding: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  {/* <Image
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%'
                    }}
                  /> */}
                  <div style={{ marginLeft: '8px' }}>
                    {/* <Breathing
                      style={{
                        width: '100px',
                        height: '16px',
                        marginBottom: '8px'
                      }}
                    />
                    <Breathing style={{ width: '80px', height: '12px' }} /> */}
                  </div>
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: 32 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell style={{ padding: '16px', width: '80px' }}>
                {/* <Breathing style={{ width: '40px', height: '16px' }} /> */}
              </TableCell>
              {Array.from({ length: 6 }).map((_, columnIndex) => (
                <TableCell key={columnIndex} style={{ padding: '16px' }}>
                  {/* <Breathing style={{ width: '100%', height: '64px' }} /> */}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* </Shimmer> */}
      <LoadingPage />
    </TableContainer>
  );

  console.log(openClassFee, ' openClassFee');

  return (
    <div
      className='mainContainer'
      style={{
        padding: '2em',
        backgroundColor: '#86a27b' //green
      }}>
      <div
        style={{
          textAlign: 'center',
          width: 'auto',
          height: profileHeight,
          overflow: 'hidden',
          transition: 'height 0.5s ease-in-out'
        }}>
        {currentUser ? (
          <div>
            {coachData ? (
              <>
                <img
                  src='/logo_trans.png'
                  alt='logo_trans'
                  width={150}
                  onClick={handleSignInOrRegister}
                  style={{ cursor: 'pointer' }}
                />

                <Typography variant='subtitle1' style={{ fontWeight: 'bold' }}>
                  {coachData.firstName}. {coachData.lastName[0]}
                </Typography>
              </>
            ) : (
              <Typography variant='subtitle1' style={{ fontWeight: 'bold' }}>
                Loading coach data...
              </Typography>
            )}
            <Button
              onClick={signOut}
              style={{ backgroundColor: '#3554A4', color: 'white' }}>
              ГАРАХ
            </Button>
          </div>
        ) : (
          <img
            src='/logo_trans.png'
            alt='logo_jojo'
            width={150}
            onClick={handleSignInOrRegister}
            style={{ cursor: 'pointer' }}
          />
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          color: 'white',
          alignItems: 'center',
          marginBottom: '16px',
          margin: '2em',
          fontSize: '1em'
        }}>
        <Button
          variant='text'
          style={{ color: 'white' }}
          onClick={handlePrevDay}>
          <ArrowBackIosNew />
        </Button>
        <div>{date.toDateString()}</div>
        <Button
          variant='text'
          style={{ color: 'white' }}
          onClick={handleNextDay}>
          <ArrowForwardIos />
        </Button>
      </div>

      {
        <TableContainer
          component={Paper}
          style={{
            overflow: 'scroll',
            height: '75vh',
            paddingBottom: '1em'
          }}
          ref={tableContainerRef}
          onScroll={isMobile ? handleTableScroll : null}
          onWheel={event => {
            const { deltaX, deltaY } = event;
            const {
              scrollTop,
              scrollLeft,
              scrollWidth,
              clientWidth,
              scrollHeight,
              clientHeight
            } = event.currentTarget;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              // Horizontal scrolling
              event.currentTarget.scrollLeft += deltaX;
              event.preventDefault();
            } else {
              // Vertical scrolling
              if (
                (scrollTop === 0 && deltaY < 0) ||
                (scrollTop + clientHeight === scrollHeight && deltaY > 0)
              ) {
                event.preventDefault();
              }
            }
          }}
          onWheelCapture={event => {
            event.stopPropagation();
          }}>
          <Table
            style={{
              backgroundColor: '#334eac',
              border: '0.5em solid white',
              borderCollapse: 'separate'
            }}>
            <TableHead>
              <TableRow
                style={{
                  borderBottom: '0.5em solid white',
                  backgroundColor: '#334eac',
                  position: 'sticky',
                  top: 0,
                  zIndex: 99
                }}>
                <TableCell
                  style={{
                    padding: '3em',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    width: '20px',
                    borderRight: '0.5em solid white',
                    borderBottom: 0,
                    borderTop: '0.5em solid white',
                    borderLeft: '0.5em solid white',
                    color: 'white',
                    position: 'sticky',
                    backgroundColor: '#334eac',
                    zIndex: 9999,
                    left: 0
                  }}>
                  <div
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Montserrat',
                      color: 'white'
                    }}>
                    Цаг
                  </div>
                </TableCell>

                {isLoading ? (
                  <TableCell
                    style={{
                      width: 'auto',
                      color: 'white',
                      transition: 'background 0.3s ease',
                      backgroundColor: '#334eac',
                      borderBottom: '0.25em solid white',
                      borderTop: '0.5em solid white',
                      padding: '3em',
                      textAlign: 'center'
                    }}>
                    <CircularProgress color='primary' />
                  </TableCell>
                ) : (
                  courts.map((court, index) => {
                    if (court.hidden) {
                      return <></>;
                    }
                    return (
                      <TableCell
                        key={court.id}
                        onMouseEnter={() => {
                          setHoveredRow(null);
                          setHoveredColumn(index + 1);
                        }}
                        onMouseLeave={() => setHoveredColumn(null)}
                        style={{
                          width: 'auto',
                          color: 'white',
                          position: 'sticky',
                          top: 0,
                          transition: 'background 0.3s ease',
                          backgroundColor: '#334eac',
                          borderBottom: '0.25em solid white',
                          borderTop: '0.5em solid white',
                          padding: '3em',
                          textAlign: 'center'
                        }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                          }}>
                          <div
                            style={{
                              width: isMobile ? '70px' : '100px',
                              height: imageHeight,
                              borderRadius: '50%',
                              overflow: 'hidden',
                              transition: 'height 0.3s ease-in-out'
                            }}>
                            <img
                              src={court.pictureUrl}
                              alt='Tennis Court Images'
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                // opacity: showImages ? 1 : 0,
                                transition: 'opacity 0.3s ease-in-out'
                              }}
                            />
                          </div>
                          <div
                            style={{
                              fontWeight: 'bold',
                              // marginTop: showImages ? '8px' : '0',
                              fontSize: isMobile ? '14px' : '18px',
                              transition: 'margin-top 0.3s ease-in-out'
                            }}>
                            {court.name}
                          </div>
                          <div
                            style={{
                              fontWeight: 'bold',
                              fontSize: isMobile ? '10px' : '14px',
                              transition: 'margin-top 0.3s ease-in-out'
                            }}>
                            {court.fee} / цаг
                          </div>
                        </div>
                      </TableCell>
                    );
                  })
                )}
              </TableRow>
            </TableHead>

            <TableBody
              style={{
                backgroundColor: '#334eac'
              }}>
              <>
                {hours.map((hour, rowIndex) => (
                  <TableRow key={hour}>
                    <TableCell
                      style={{
                        backgroundColor:
                          hoveredRow === rowIndex ? 'white' : '#334EAC',
                        color: hoveredRow === rowIndex ? 'black' : 'white',
                        transition: 'background 0.3s ease',
                        fontWeight: hoveredRow === rowIndex ? 'bold' : 'normal',
                        position: 'sticky',
                        left: 0,
                        borderLeft: '0.5em solid white',
                        overflow: 'hidden',
                        textAlign: 'center',
                        borderRight: '0.5em solid white',
                        borderBottom: 0
                      }}
                      onMouseEnter={() => {
                        setHoveredRow(rowIndex);
                        setHoveredColumn(0);
                      }}
                      onMouseLeave={() => {
                        // Check if the mouse is not hovering over any column cell
                        if (hoveredColumn === 0) {
                          setHoveredRow(null);
                          setHoveredColumn(null);
                        }
                      }}>
                      {hour}
                    </TableCell>
                    {courts.map((court, columnIndex) => {
                      if (court.hidden) {
                        return <></>;
                      }
                      const slot = new Date(date);
                      const [slotHour, slotMinute] = hour
                        .split(':')
                        .map(Number);
                      slot.setHours(slotHour, slotMinute, 0, 0);

                      const bookingDetails = getBookingDetails(court.id, slot);

                      const isBooked =
                        bookingDetails !== null &&
                        bookingDetails['bookingStatus'] === 'booked';

                      const currentTime = new Date();
                      const isPastTime = slot < currentTime;

                      if (isBooked) {
                        const nextSlot = new Date(slot);
                        nextSlot.setMinutes(slot.getMinutes() + 30);
                        let nextBookingDetails = getBookingDetails(
                          court.id,
                          nextSlot
                        );

                        let rowSpan = 1;
                        while (
                          nextBookingDetails &&
                          nextBookingDetails.name === bookingDetails.name &&
                          nextBookingDetails.phone === bookingDetails.phone
                        ) {
                          rowSpan++;
                          nextSlot.setMinutes(nextSlot.getMinutes() + 30);
                          nextBookingDetails = getBookingDetails(
                            court.id,
                            nextSlot
                          );
                        }

                        if (
                          rowIndex === 0 ||
                          !getBookingDetails(
                            court.id,
                            new Date(slot.getTime() - 1800000)
                          ) ||
                          (getBookingDetails(
                            court.id,
                            new Date(slot.getTime() - 1800000)
                          ) &&
                            getBookingDetails(
                              court.id,
                              new Date(slot.getTime() - 1800000)
                            ).name !== bookingDetails.name)
                        ) {
                          const isCoachBooking = bookingDetails.isCoach;
                          const isOpenClass = bookingDetails.isOpenClass;

                          const bookingColor = isCoachBooking
                            ? bookingDetails.color
                            : '#ccc';

                          const textColor = isCoachBooking ? 'white' : 'black';
                          if (isOpenClass) {
                            const {
                              startTime,
                              endTime,
                              classFee,
                              availableSlot
                            } = bookingDetails;
                            return (
                              <TableCell
                                key={`${court.id}-${hour}`}
                                rowSpan={rowSpan}
                                style={{
                                  background: bookingColor,
                                  color: textColor,
                                  cursor: 'pointer',
                                  border: 0,
                                  textAlign: 'center'
                                }}>
                                <div>
                                  {isCoachBooking
                                    ? bookingDetails.name
                                    : bookingDetails.name.slice(0, 10)}
                                </div>
                                <div style={{ fontSize: '16px' }}>
                                  <br />
                                  {formatTime(
                                    new Date(bookingDetails.startTime)
                                  )}{' '}
                                  -{' '}
                                  {formatTime(new Date(bookingDetails.endTime))}
                                </div>

                                <div style={{ fontSize: '16px' }}>
                                  {bookingDetails.classLevel}
                                </div>

                                <div>
                                  <br />
                                  Сул зай: {availableSlot}
                                  <br />
                                  <br />
                                </div>

                                <Button
                                  onClick={() =>
                                    handleOpenClassBooking(
                                      court.id,
                                      new Date(startTime),
                                      new Date(endTime),
                                      classFee,
                                      bookingDetails
                                    )
                                  }
                                  style={{
                                    color: 'white',
                                    border: `1px solid white`
                                  }}
                                  variant='outlined'>
                                  Бүртгүүлэх
                                </Button>
                              </TableCell>
                            );
                          }

                          return (
                            <TableCell
                              key={`${court.id}-${hour}`}
                              rowSpan={rowSpan}
                              onMouseEnter={() => {
                                setHoveredRow(rowIndex);
                                setHoveredColumn(columnIndex + 1);
                              }}
                              onMouseLeave={() => {
                                setHoveredRow(null);
                                setHoveredColumn(null);
                              }}
                              style={{
                                background: bookingColor,
                                color: textColor,
                                cursor: 'default',
                                //     : 'none
                                border: 0,
                                textAlign: 'center'
                              }}>
                              <div>
                                {isCoachBooking ? `Хичээлтэй` : `Захиалгатай`}
                              </div>
                              <div>
                                {isCoachBooking
                                  ? bookingDetails.name
                                  : bookingDetails.name.slice(0, 10)}
                              </div>
                              <div style={{ fontSize: '12px' }}>
                                {formatTime(new Date(bookingDetails.startTime))}{' '}
                                - {formatTime(new Date(bookingDetails.endTime))}
                              </div>
                            </TableCell>
                          );
                        } else {
                          return null;
                        }
                      } else {
                        const currentCell = `${rowIndex}${columnIndex + 1}`;

                        return (
                          <TableCell
                            key={`${court.id}-${hour}`}
                            onMouseEnter={() => {
                              setHoveredRow(rowIndex);
                              setHoveredColumn(columnIndex + 1);
                              setHoveredCell(`${rowIndex}${columnIndex + 1}`);
                            }}
                            onMouseLeave={() => {
                              setHoveredRow(null);
                              setHoveredColumn(null);
                              setHoveredCell(null);
                            }}
                            style={{
                              backgroundColor: isPastTime
                                ? 'inherit'
                                : hoveredCell === currentCell
                                  ? '#334eac'
                                  : '#eee',
                              cursor: isPastTime ? 'not-allowed' : 'pointer',
                              textAlign: 'center',
                              border: 0,
                              color: isPastTime
                                ? '#999'
                                : hoveredCell === currentCell
                                  ? 'white'
                                  : '#000'
                            }}
                            onClick={() => {
                              if (!isPastTime) {
                                handleBooking(court.id, hour);
                              }
                            }}>
                            {isPastTime ? '' : '+'}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                ))}
              </>
            </TableBody>
            {/* </div> */}
          </Table>
        </TableContainer>
      }
      <Dialog
        open={bookingFormOpen || showQRCodePage || showBookingConfirmation}
        onClose={handleCloseBookingForm}>
        {classFull ? (
          <div>Sorry class is full</div>
        ) : showBookingConfirmation ? (
          <BookingConfirmation />
        ) : showQRCodePage ? (
          <div>
            <DialogTitle
              style={{
                backgroundColor: '#3554A4',
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
              QPay Төлбөр
            </DialogTitle>
            <DialogContent>
              {openClassBookingFormOpen ? (
                <h2> Төлбөр хийгдсэнээр таны зай баталгаажихыг анхаарна уу </h2>
              ) : (
                <></>
              )}
              <h5>Доорх QR кодийг QPay ээр уншуулж, төлбөрөө төлнө үү.</h5>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src={`data:image/jpeg;base64,${qrCodeData.qr_image}`}
                  alt='QR Code'
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
              {showPaymentCompleteWarning && (
                <div>Төлбөр хараахан төлөгдөөгүй байна.</div>
              )}
              {isMobile && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Button onClick={() => setShowBankList(true)}>
                    Банкны апп-аар төлөх
                  </Button>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                disabled={loading}
                onClick={() => {}}
                variant='contained'
                style={{ backgroundColor: '#3554A4' }}>
                {loading ? <CircularProgress size={24} /> : 'Төлбөр Шалгах'}
              </Button>
              <Button
                onClick={handleCloseQRCodePage}
                variant='contained'
                style={{ backgroundColor: '#3554A4' }}>
                Цуцлах
              </Button>
            </DialogActions>
            {isMobile && showBankList && (
              <BankListOverlay
                bankData={qPayMobileBankData}
                onClose={() => setShowBankList(false)}
              />
            )}
          </div>
        ) : (
          <>
            <DialogTitle
              style={{
                backgroundColor: '#334eac',
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
              Захиалга
            </DialogTitle>
            <DialogContent>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                <img
                  src={selectedCourtObject?.pictureUrl}
                  alt='Tennis Court'
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    marginRight: '16px'
                  }}
                />
                <Typography variant='h6'>
                  {selectedCourtObject?.name}
                </Typography>
              </div>
              {isCoachLoggedIn ? (
                <FormControl
                  fullWidth
                  variant='outlined'
                  style={{ marginTop: '16px' }}>
                  <InputLabel htmlFor='coach-select-label'>
                    Хичээлийн багш
                  </InputLabel>
                  <Select
                    labelId='coach-select'
                    id='coach-select'
                    value={selectedCoach}
                    onChange={e => setSelectedCoach(e.target.value)}
                    input={<OutlinedInput labelWidth={120} notchedOutline />}
                    renderValue={selected => {
                      return (
                        <div>
                          {selected
                            ? `${
                                coaches.find(
                                  coach =>
                                    coach &&
                                    coach.id.toLowerCase() ===
                                      selected.toLowerCase()
                                )?.firstName
                              } ${
                                coaches.find(
                                  coach =>
                                    coach &&
                                    coach.id.toLowerCase() ===
                                      selected.toLowerCase()
                                )?.lastName
                              }`
                            : 'Хичээлийн багшийг сонгоно уу'}
                        </div>
                      );
                    }}>
                    {coaches
                      .filter(
                        coach => coachData && coach && coach.id !== coachData.id
                      )
                      .sort((a, b) => a.firstName.localeCompare(b.firstName))
                      .map(coach => (
                        <MenuItem key={coach.id} value={coach.id}>
                          {`${coach.firstName} ${coach.lastName}`}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              ) : (
                <>
                  <TextField
                    margin='dense'
                    id='name'
                    label='Нэр'
                    type='text'
                    name='name'
                    value={bookingInfo.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      margin='dense'
                      id='phoneNumber'
                      label='Утас'
                      type='tel'
                      name='phoneNumber'
                      value={bookingInfo.phoneNumber}
                      onChange={e => {
                        const newValue = e.target.value.startsWith('+976')
                          ? e.target.value.slice(4)
                          : e.target.value;
                        handleInputChange({
                          target: { name: 'phoneNumber', value: newValue }
                        });
                      }}
                      fullWidth
                      required
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber}
                      InputProps={{
                        startAdornment: (
                          <span style={{ marginRight: '8px' }}>+976</span>
                        )
                      }}
                    />
                  </div>
                </>
              )}
              <TextField
                margin='dense'
                id='startDate'
                label='Эхлэх цаг'
                type='text'
                value={
                  selectedSlot
                    ? selectedSlot.toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      }) +
                      (selectedSlot
                        ? selectedSlot.getHours() >= 12
                          ? ' PM'
                          : ' AM'
                        : '')
                    : ''
                }
                fullWidth
                disabled
              />
              <Select
                value={selectedEndSlot || ''}
                disabled={openClassBookingFormOpen}
                onChange={e => {
                  openClass4Coach &&
                    setOpenClassFee(calculateFeeForOpenClass(true));
                  setSelectedEndSlot(e.target.value);
                }}
                fullWidth
                displayEmpty
                renderValue={selected => (
                  <div>
                    {selected
                      ? `${formatTime(selected)} хүртэл`
                      : 'Дуусах хугацаа'}
                  </div>
                )}
                required
                error={!!errors.endSlot}>
                {selectedSlot &&
                  generateAvailableEndSlots().map((slot, index) => (
                    <MenuItem key={index} value={slot}>
                      {formatTime(slot)}
                    </MenuItem>
                  ))}
              </Select>
              {isCoachLoggedIn && (
                <>
                  <FormControlLabel
                    label='Нээлттэй анги'
                    control={
                      <Checkbox
                        {...label}
                        checked={openClass4Coach}
                        color='success'
                        onChange={() => {
                          setOpenClass4Coach(!openClass4Coach);
                        }}
                      />
                    }
                  />
                  {openClass4Coach && (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1em'
                        }}>
                        <Select
                          value={classLevel}
                          onChange={e => setClassLevel(e.target.value)}
                          fullWidth
                          displayEmpty
                          renderValue={selected => (
                            <div>{selected ? selected : 'Түвшин'}</div>
                          )}
                          required={true}
                          error={!!errors.classLevel}>
                          {classLevels.map((classLevel, index) => (
                            <MenuItem key={index} value={classLevel}>
                              {classLevel}
                            </MenuItem>
                          ))}
                        </Select>

                        <TextField
                          margin='dense'
                          id='availableSlot'
                          variant='outlined'
                          label='Хүний тоо'
                          type='number'
                          name='availableSlot'
                          error={!!errors.availableSlot}
                          value={availableSlot}
                          onChange={e => {
                            setAvailableSlot(e.target.value);
                          }}
                          required
                        />

                        <TextField
                          margin='dense'
                          id='availableSlot'
                          variant='outlined'
                          label='Төлбөр'
                          type='number'
                          name='availableSlot'
                          error={!!errors.openClassFee}
                          value={openClassFee}
                          onChange={e => {
                            setOpenClassFee(e.target.value);
                          }}
                          required
                        />
                        <div style={{ textAlign: 'right' }}>
                          Төлбөр:{' '}
                          {openClass4Coach
                            ? openClassFee
                            : calculateFeeForOpenClass()}
                          ₮
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {!isCoachLoggedIn && selectedEndSlot && (
                <Typography
                  variant='body1'
                  style={{
                    marginTop: '20px',
                    color: '#3554A4',
                    fontWeight: 'bold'
                  }}>
                  Төлбөр:{' '}
                  {calculateTotalFee(
                    selectedSlot,
                    selectedEndSlot,
                    selectedCourtObject,
                    true,
                    openClassBookingFormOpen
                  )}
                </Typography>
              )}
              {!isCoachLoggedIn &&
                (openClassBookingFormOpen ? (
                  <Typography>
                    Төлбөр хийгдсэнээр таны зай баталгаажихыг анхаарна уу
                  </Typography>
                ) : (
                  <Typography>
                    <p>⚠️ Анхаарах зүйл ⚠️ </p>
                    Захиалга хийгдсэн тохиолдолд, цуцлах боломжгүй гэдгийг
                    анхаарна уу. Тиймээс буцаан олголт хийгдэхгүй болно.
                  </Typography>
                ))}
              {errors.endSlot && (
                <Typography variant='caption' color='error'>
                  {errors.endSlot}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                disabled={disableDiscardBtn}
                onClick={handleCloseBookingForm}>
                Болих
              </Button>
              <Button
                onClick={handleBookingSubmit}
                variant='contained'
                style={{ backgroundColor: '#3554A4' }}>
                {loading ? <CircularProgress size={24} /> : 'Захиалах'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <OpenClassIntro />
    </div>
  );
}

export default TennisCourtBooking;
