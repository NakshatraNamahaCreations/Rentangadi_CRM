// import React, { useState, useEffect } from "react";
// import { Button, Card, Container, Form, Table } from "react-bootstrap";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import { MdVisibility, MdDelete } from "react-icons/md";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import Pagination from "../../components/Pagination";
// import axios from "axios";
// import { ApiURL } from "../../api";

// const localizer = momentLocalizer(moment);

// const PAGE_SIZE = 10;

// const Orders = () => {
//   const [viewMode, setViewMode] = useState("list");
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [deletingId, setDeletingId] = useState(null);
//   const [selectedOrders, setSelectedOrders] = useState([]); // Track selected rows
//   const navigate = useNavigate();

//   // Fetch orders from API
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await axios.get(`${ApiURL}/order/getallorder`);
//         if (res.status === 200) {
//           const transformed = res.data.orderData.map((order) => {
//             // Iterate through the slots and get the quoteDate
//             const slotsWithQuoteDates = order.slots.map((slot) => ({
//               ...slot,
//               quoteDate: slot.quoteDate,
//             }));

//             return {
//               ...order,
//               companyName: order.clientName,
//               executiveName: order.executivename,
//               grandTotal: order.GrandTotal,
//               bookingDate: order.createdAt,
//               slots: slotsWithQuoteDates,
//               address: order.Address,
//               id: order._id,
//               orderStatus: order.orderStatus,
//             };
//           });
//           setOrders(transformed);
//         }
//       } catch (error) {
//         setOrders([]);
//       }
//     };
//     fetchOrders();
//   }, []);

//   // Filtering logic
//   useEffect(() => {
//     let data = [...orders];
//     const query = searchQuery.toLowerCase();

//     if (query) {
//       data = data.filter(
//         (order) =>
//           (order.companyName || "").toLowerCase().includes(query) ||
//           (order.executiveName || "").toLowerCase().includes(query) ||
//           (order.address || "").toLowerCase().includes(query) ||
//           String(order.grandTotal || "").includes(query) ||
//           (order.orderStatus || "").toLowerCase().includes(query)
//       );
//     }

//     // Filter by fromDate (quoteDate inside slots)
//     if (fromDate) {
//       data = data.filter((order) =>
//         order.slots.some((slot) =>
//           moment(slot.quoteDate, "DD-MM-YYYY").isSameOrAfter(
//             moment(fromDate, "YYYY-MM-DD")
//           )
//         )
//       );
//     }

//     // Filter by toDate (quoteDate inside slots)
//     if (toDate) {
//       data = data.filter((order) =>
//         order.slots.some((slot) =>
//           moment(slot.quoteDate, "DD-MM-YYYY").isSameOrBefore(
//             moment(toDate, "YYYY-MM-DD")
//           )
//         )
//       );
//     }

//     setFilteredOrders(data);
//     setCurrentPage(1);
//   }, [orders, searchQuery, fromDate, toDate]);

//   // Pagination logic
//   const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
//   const paginatedOrders = filteredOrders.slice(
//     (currentPage - 1) * PAGE_SIZE,
//     currentPage * PAGE_SIZE
//   );

//   // Calendar events: Group orders by quoteDate in slots
//   const ordersCountByDate = filteredOrders.reduce((acc, order) => {
//     order.slots.forEach((slot) => {
//       const dateKey = moment(slot.quoteDate, "DD-MM-YYYY").format("YYYY-MM-DD");
//       acc[dateKey] = acc[dateKey] || [];
//       acc[dateKey].push(order);
//     });
//     return acc;
//   }, {});

//   const calendarEvents = Object.entries(ordersCountByDate).map(
//     ([date, ordersArr]) => ({
//       title: `Orders: ${ordersArr.length}`,
//       start: new Date(date),
//       end: new Date(date),
//       allDay: true,
//       orders: ordersArr,
//       date,
//     })
//   );

//   const handleCalendarEventClick = (event) => {
//     navigate(`/orders-by-date/${event.date}`);
//   };

//   // Delete order
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this order?")) return;
//     setDeletingId(id);
//     try {
//       await axios.delete(`${ApiURL}/order/delete/${id}`);
//       setOrders((prev) => prev.filter((order) => order.id !== id));
//     } catch (err) {
//       alert("Failed to delete order.");
//     }
//     setDeletingId(null);
//   };

//   // Row select handler
//   const handleSelectRow = (id) => {
//     setSelectedOrders((prev) =>
//       prev.includes(id)
//         ? prev.filter((orderId) => orderId !== id)
//         : [...prev, id]
//     );
//   };

//   // Select all rows
//   const handleSelectAll = () => {
//     if (selectedOrders.length === paginatedOrders.length) {
//       setSelectedOrders([]);
//     } else {
//       setSelectedOrders(paginatedOrders.map((order) => order.id));
//     }
//   };

//   // Delete selected orders
//   const handleDeleteSelected = async () => {
//     if (!window.confirm("Are you sure you want to delete selected orders?"))
//       return;
//     for (const id of selectedOrders) {
//       try {
//         await axios.delete(`${ApiURL}/order/delete/${id}`);
//       } catch (err) {
//         alert("Failed to delete some orders.");
//       }
//     }
//     setOrders((prev) =>
//       prev.filter((order) => !selectedOrders.includes(order.id))
//     );
//     setSelectedOrders([]);
//   };

//   const eventStyleGetter = (event) => ({
//     style: {
//       backgroundColor: "#323D4F",
//       color: "white",
//       borderRadius: "4px",
//       border: "none",
//     },
//   });

//   return (
//     <Container className="my-4">
//       {/* Header */}
//       <Card className="shadow-sm mb-4">
//         <Card.Body className="text-center">
//           <h2 style={{ fontSize: "1.75rem" }}>Order Management</h2>
//         </Card.Body>
//       </Card>

//       {/* Controls */}
//       <Card className="shadow-sm mb-4">
//         <Card.Body>
//           <div className="row align-items-center">
//             <div className="col-md-6 mb-3 mb-md-0">
//               <Form.Check
//                 type="switch"
//                 id="view-toggle"
//                 label={
//                   viewMode === "list"
//                     ? "Switch to Calendar View"
//                     : "Switch to List View"
//                 }
//                 onChange={() =>
//                   setViewMode(viewMode === "list" ? "calendar" : "list")
//                 }
//                 checked={viewMode === "calendar"}
//               />
//             </div>
//             {viewMode === "list" && (
//               <>
//                 <div className="col-md-3 mb-3 mb-md-0">
//                   <Form.Control
//                     type="date"
//                     value={fromDate}
//                     onChange={(e) => setFromDate(e.target.value)}
//                     size="sm"
//                     placeholder="From date"
//                   />
//                 </div>
//                 <div className="col-md-3 mb-3 mb-md-0">
//                   <Form.Control
//                     type="date"
//                     value={toDate}
//                     onChange={(e) => setToDate(e.target.value)}
//                     size="sm"
//                     placeholder="To date"
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//           {viewMode === "list" && (
//             <div className="d-flex justify-content-between align-items-center py-2">
//               <div className="col-md-4 mt-3">
//                 <Form.Control
//                   type="text"
//                   placeholder="Search by Company, Executive, Date, Amount, Address, Status"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   size="sm"
//                 />
//               </div>
//               {selectedOrders.length > 0 && (
//                 <Button
//                   variant="outline-danger"
//                   size="sm"
//                   onClick={handleDeleteSelected}
//                 >
//                   Delete {selectedOrders.length} Selected Orders
//                 </Button>
//               )}
//             </div>
//           )}
//         </Card.Body>
//       </Card>

//       {/* Content */}
//       {viewMode === "list" ? (
//         <Card className="shadow-sm">
//           <div className="table-responsive">
//             <Table
//               striped
//               hover
//               bordered
//               className="mb-0"
//               style={{ fontSize: "0.85rem" }}
//             >
//               <thead style={{ backgroundColor: "#f8f9fa" }}>
//                 <tr>
//                   <th style={{ width: "5%" }}>
//                     <input
//                       type="checkbox"
//                       checked={selectedOrders.length === paginatedOrders.length}
//                       onChange={handleSelectAll}
//                     />
//                   </th>
//                   <th style={{ width: "10%" }}>Booking Date</th>
//                   <th style={{ width: "15%" }}>Company Name</th>
//                   <th style={{ width: "15%" }}>Executive Name</th>
//                   <th style={{ width: "10%" }}>Grand Total</th>
//                   <th style={{ width: "10%" }}>Quote Date</th>
//                   <th style={{ width: "25%" }}>Address</th>
//                   <th style={{ width: "15%" }} className="text-center">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedOrders.map((order) => {
//                   const quoteDate =
//                     order.slots.length > 0 ? order.slots[0].quoteDate : "";
//                   const isSelected = selectedOrders.includes(order.id); // Check if selected
//                   return (
//                     <tr
//                       key={order.id}
//                       style={{ verticalAlign: "middle" }}
//                       onClick={() => handleSelectRow(order.id)}
//                       className={isSelected ? "table-info" : ""}
//                     >
//                       <td>
//                         <input
//                           type="checkbox"
//                           checked={isSelected}
//                           onChange={() => handleSelectRow(order.id)}
//                         />
//                       </td>
//                       <td>{moment(order.bookingDate).format("MM/DD/YYYY")}</td>
//                       <td>{order.companyName}</td>
//                       <td>{order.executiveName}</td>
//                       <td>{order.grandTotal}</td>
//                       {/* <td>{moment(quoteDate).format("MM/DD/YYYY")}</td> */}
//                    <td>{quoteDate}</td>

//                       <td>{order.address}</td>
//                       <td className="text-center">
//                         <Button
//                           variant="outline-dark"
//                           size="sm"
//                           onClick={() =>
//                             navigate(`/orders-details/${order.id}`)
//                           }
//                           className="me-2"
//                           title="View"
//                         >
//                           <MdVisibility />
//                         </Button>
//                         <Button
//                           variant="outline-danger"
//                           size="sm"
//                           onClick={() => handleDelete(order.id)}
//                           disabled={deletingId === order.id}
//                           title="Delete"
//                         >
//                           <MdDelete />
//                         </Button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//                 {paginatedOrders.length === 0 && (
//                   <tr>
//                     <td colSpan="8" className="text-center text-muted">
//                       No orders found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </div>
//           <Pagination
//             totalItems={filteredOrders.length}
//             pageSize={PAGE_SIZE}
//             currentPage={currentPage}
//             onPageChange={setCurrentPage}
//           />
//         </Card>
//       ) : (
//         <Card className="shadow-sm p-3">
//           <Calendar
//             localizer={localizer}
//             events={calendarEvents}
//             startAccessor="start"
//             endAccessor="end"
//             style={{ height: 600 }}
//             views={["month", "week", "day", "agenda"]}
//             popup
//             selectable
//             onSelectEvent={handleCalendarEventClick}
//             eventPropGetter={eventStyleGetter}
//           />
//         </Card>
//       )}
//     </Container>
//   );
// };

// export default Orders;

import React, { useState, useEffect } from "react";
import { Button, Card, Container, Form, Table } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { MdVisibility } from "react-icons/md";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Pagination from "../../components/Pagination";
import axios from "axios";
import { ApiURL } from "../../api";

const localizer = momentLocalizer(moment);

const PAGE_SIZE = 10;

const Orders = () => {
  const [viewMode, setViewMode] = useState("list");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${ApiURL}/order/getallorder`);
        if (res.status === 200) {
          const transformed = res.data.orderData.map((order) => {
            const slotsWithQuoteDates = order.slots.map((slot) => ({
              ...slot,
              quoteDate: slot.quoteDate,
            }));

            return {
              ...order,
              companyName: order.clientName,
              executiveName: order.executivename,
              grandTotal: order.GrandTotal,
              bookingDate: order.createdAt,
              slots: slotsWithQuoteDates,
              address: order.Address,
              id: order._id,
              orderStatus: order.orderStatus,
            };
          });
          setOrders(transformed);
        }
      } catch (error) {
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  // Filtering logic
  useEffect(() => {
    let data = [...orders];
    const query = searchQuery.toLowerCase();

    if (query) {
      data = data.filter(
        (order) =>
          (order.companyName || "").toLowerCase().includes(query) ||
          (order.executiveName || "").toLowerCase().includes(query) ||
          (order.address || "").toLowerCase().includes(query) ||
          // String(order.grandTotal || "").includes(query) ||
          (order.orderStatus || "").toLowerCase().includes(query)
      );
    }

    if (fromDate) {
      data = data.filter((order) =>
        order.slots.some((slot) =>
          moment(slot.quoteDate, "DD-MM-YYYY").isSameOrAfter(
            moment(fromDate, "YYYY-MM-DD")
          )
        )
      );
    }

    if (toDate) {
      data = data.filter((order) =>
        order.slots.some((slot) =>
          moment(slot.quoteDate, "DD-MM-YYYY").isSameOrBefore(
            moment(toDate, "YYYY-MM-DD")
          )
        )
      );
    }

    setFilteredOrders(data);
    setCurrentPage(1);
  }, [orders, searchQuery, fromDate, toDate]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Calendar events
  const ordersCountByDate = filteredOrders.reduce((acc, order) => {
    order.slots.forEach((slot) => {
      const dateKey = moment(slot.quoteDate, "DD-MM-YYYY").format("YYYY-MM-DD");
      acc[dateKey] = acc[dateKey] || [];
      acc[dateKey].push(order);
    });
    return acc;
  }, {});

  const calendarEvents = Object.entries(ordersCountByDate).map(
    ([date, ordersArr]) => ({
      title: `Orders: ${ordersArr.length}`,
      start: new Date(date),
      end: new Date(date),
      allDay: true,
      orders: ordersArr,
      date,
    })
  );

  const handleCalendarEventClick = (event) => {
    navigate(`/orders-by-date/${event.date}`);
  };

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: "#323D4F",
      color: "white",
      borderRadius: "4px",
      border: "none",
    },
  });

  return (
    <Container className="my-4">
      {/* Header */}
      <Card className="shadow-sm mb-4">
        <Card.Body className="text-center">
          <h2 style={{ fontSize: "1.75rem" }}>Order Management</h2>
        </Card.Body>
      </Card>

      {/* Controls */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <Form.Check
                type="switch"
                id="view-toggle"
                label={
                  viewMode === "list"
                    ? "Switch to Calendar View"
                    : "Switch to List View"
                }
                onChange={() =>
                  setViewMode(viewMode === "list" ? "calendar" : "list")
                }
                checked={viewMode === "calendar"}
              />
            </div>
            {viewMode === "list" && (
              <>
                <div className="col-md-3 mb-3 mb-md-0">
                  <Form.Control
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    size="sm"
                  />
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                  <Form.Control
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    size="sm"
                  />
                </div>
              </>
            )}
          </div>
          {viewMode === "list" && (
            <div className="d-flex justify-content-between align-items-center py-2">
              <div className="col-md-4 mt-3">
                <Form.Control
                  type="text"
                  placeholder="Search by Company, Executive, Date, Amount, Address, Status"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="sm"
                />
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Content */}
      {viewMode === "list" ? (
        <Card className="shadow-sm">
          <div className="table-responsive">
            <Table
              striped
              hover
              bordered
              className="mb-0"
              style={{ fontSize: "0.85rem" }}
            >
              <thead style={{ backgroundColor: "#f8f9fa" }}>
                <tr>
                  <th style={{ width: "10%" }}>Booking Date</th>
                  <th style={{ width: "15%" }}>Company Name</th>
                  <th style={{ width: "15%" }}>Executive Name</th>
                  <th style={{ width: "10%" }}>Grand Total</th>
                  <th style={{ width: "10%" }}>Quote Date</th>
                  <th style={{ width: "25%" }}>Address</th>
                  <th style={{ width: "15%" }} className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => {
                  const quoteDate =
                    order.slots.length > 0 ? order.slots[0].quoteDate : "";
                  return (
                    <tr key={order.id} style={{ verticalAlign: "middle" }}>
                      <td>{moment(order.bookingDate).format("DD-MM-YYYY")}</td>
                      <td>{order.companyName}</td>
                      <td>{order.executiveName}</td>
                      <td>{order.grandTotal}</td>
                      <td>{quoteDate}</td>
                      <td>{order.address}</td>
                      <td className="text-center">
                        <Button
                          variant="outline-dark"
                          size="sm"
                          onClick={() =>
                            navigate(`/orders-details/${order.id}`)
                          }
                          title="View"
                        >
                          <MdVisibility />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {paginatedOrders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          <Pagination
            totalItems={filteredOrders.length}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </Card>
      ) : (
        <Card className="shadow-sm p-3">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            views={["month", "week", "day", "agenda"]}
            popup
            selectable
            onSelectEvent={handleCalendarEventClick}
            eventPropGetter={eventStyleGetter}
          />
        </Card>
      )}
    </Container>
  );
};

export default Orders;
