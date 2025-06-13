// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Col,
//   Card,
//   Container,
//   Row,
//   Form,
//   Table,
//   Modal,
//   Spinner,
// } from "react-bootstrap";
// import logo from "../../assets/RentangadiLogo.jpg";
// import { useFetcher, useParams } from "react-router-dom";
// import axios from "axios";
// import { ApiURL, ImageApiURL } from "../../api";
// import Select from "react-select";
// import {
//   FaEdit,
//   FaTrashAlt,
//   FaUser,
//   FaBuilding,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaCalendarAlt,
//   FaClock,
//   FaCheck,
//   FaTimes,
// } from "react-icons/fa";
// import { toast } from 'react-hot-toast'

// const QuotationDetails = () => {
//   const { id } = useParams();
//   const [quotation, setQuotation] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showGenerateModal, setShowGenerateModal] = useState(false);
//   const [paymentData, setPaymentData] = useState({
//     status: "Online",
//     amount: 0,
//     mode: "",
//     comments: "",
//     date: new Date().toLocaleDateString("en-GB").split("/").join("-"),
//   });
//   const [showAdd, setShowAdd] = useState(false);
//   const [allProducts, setAllProducts] = useState([]);
//   const [addProductId, setAddProductId] = useState("");
//   const [addQty, setAddQty] = useState(1);
//   const [selectedAddProduct, setSelectedAddProduct] = useState(null);
//   const [getPayment, setGetPayment] = useState("")
//   const [editIdx, setEditIdx] = useState(null);
//   const [editQty, setEditQty] = useState(1);


//   // const [grandTotal, setGrandTotal] = useState(0)

//   const fetchAllProducts = async () => {
//     try {
//       const res = await axios.get(`${ApiURL}/product/quoteproducts`);
//       // console.log("fetch prods: ", res.data)
//       if (res.status === 200) {
//         setAllProducts(res.data.QuoteProduct || []);
//       }
//     } catch (error) {
//       console.error("Error fetching all products:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllProducts()
//   }, [])

//   useEffect(() => {
//     const fetchQuotation = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(`${ApiURL}/quotations/getquotation/${id}`);
//         console.log("getquotation/ quoteData: ", res.data.quoteData)
//         // console.log("quoteData slots", res.data.quoteData.slots)
//         setQuotation(res.data.quoteData);
//       } catch (error) {
//         setQuotation(null);
//       }
//       setLoading(false);
//     };
//     fetchQuotation();
//   }, [id]);

//   const handleShowGenerateModal = () => setShowGenerateModal(true);
//   const handleCloseGenerateModal = () => setShowGenerateModal(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setPaymentData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCheckboxChange = (status) => {
//     setPaymentData((prev) => ({ ...prev, status }));
//   };

//   const handleAddPayment = async () => {
//     try {
//       // First, make the API call to fetch payment data
//       const orderDetails = {
//         quotationId: quotation?._id,
//         totalAmount: quotation?.GrandTotal,
//         advancedAmount: paymentData.amount,
//         paymentMode: paymentData.status, // Send selected payment mode
//         paymentRemarks: paymentData.status === "Offline" ? "cash" : paymentData.mode,
//         comment: paymentData.comments,
//         status: "Completed",
//       };

//       // Make the POST request to add payment
//       const response = await axios.post(
//         "https://api.rentangadi.in/api/payment/",
//         orderDetails
//       );


//       // // If the API call is successful, update the payment data state
//       if (response.status === 200) {
//         console.log("payment successful: ", response.data)
//         // await handleUpdateQuotation()
//         await handleGenerateOrder()
//         setGetPayment(response.data);
//       }
//       console.log("payment details: ", orderDetails)

//       // Then, update the quotation state with the new payment details
//       // setQuotation((prev) => ({
//       //   ...prev,
//       //   payments: [
//       //     ...(prev.payments || []),
//       //     {
//       //       date: paymentData.date,
//       //       amount: parseFloat(paymentData.amount),
//       //       status: paymentData.status,
//       //       mode: paymentData.mode,
//       //     },
//       //   ],
//       //   remainingAmount:
//       //     (prev.remainingAmount || 0) - parseFloat(paymentData.amount),
//       // }));

//       // Reset paymentData after the payment is added
//       // setPaymentData({
//       //   status: "Online",
//       //   amount: 0,
//       //   mode: "",
//       //   comments: "",
//       //   date: new Date().toLocaleDateString("en-GB").split("/").join("-"),
//       // });

//       // Close the modal after the action

//     } catch (error) {
//       console.error("Error fetching payment data:", error);
//       // Optionally handle any errors that occur during the API request
//     } finally {
//       handleCloseGenerateModal();
//     }
//   };

//   // const handleUpdateQuotation = async () => {
//   //   try {
//   //     // Prepare the updated quotation details
//   //     const updatedQuotationDetails = {
//   //       enquiryId: quotation.enquiryId,
//   //       GrandTotal: grandTotal, // updated GrandTotal
//   //       status: quotation?.status, // You can set status to 'updated' or other if needed
//   //       slots: quotation?.slots?.map((slot) => ({
//   //         slotName: slot.slotName,
//   //         quoteDate: slot.quoteDate,
//   //         endDate: slot.endDate,
//   //         Products: slot.Products?.map((product) => ({
//   //           productId: product.productId,
//   //           productName: product.productName,
//   //           quantity: product.quantity || product.qty,
//   //           total: product.total, // Recalculate total if needed
//   //         })) || [],
//   //       })) || [], // Default to empty array if no slots found
//   //     };

//   //     console.log("Updated Quotation details: ", updatedQuotationDetails);

//   //     // Make the API call to update the quotation
//   //     const response = await axios.put(
//   //       `${ApiURL}/quotations/updateQuotationOnOrder/${quotation._id}`,  // Adjust the URL based on your API
//   //       updatedQuotationDetails
//   //     );

//   //     // Check if the response is successful
//   //     if (response.status === 200) {
//   //       console.log("Quotation updated successfully:", response.data.response);
//   //       // Optionally, update the state or show a success message
//   //       // Example: setQuotationDetails(response.data.response);
//   //     } else {
//   //       console.error("Failed to update the quotation. Response status:", response.status);
//   //     }
//   //   } catch (error) {
//   //     // Handle errors during the API call
//   //     console.error("Error updating quotation:", error.data.error);
//   //   } finally {
//   //     handleCloseGenerateModal(); // Close the modal or perform any final actions
//   //   }
//   // };

//   const handleUpdateQuotation = async () => {
//     try {
//       // Flatten all products from all slots for the Products array
//       const allProducts = quotation?.slots
//         ? quotation.slots.flatMap(slot =>
//           (slot.Products || []).map(product => ({
//             productId: product.productId,
//             productName: product.productName,
//             qty: product.qty || product.quantity,
//             price: product.price,
//             quantity: product.quantity || product.qty,
//             total: product.total,
//             StockAvailable: product.availableStock, // if needed by backend
//           }))
//         )
//         : [];

//       // Prepare the updated quotation details
//       const updatedQuotationDetails = {
//         enquiryObjectId: quotation._id, // Add this if your backend expects it
//         enquiryId: quotation.enquiryId,
//         GrandTotal: grandTotal, // updated GrandTotal
//         status: quotation?.status,
//         Products: allProducts, // Flat array for backend update logic
//         slots: quotation?.slots?.map((slot) => ({
//           slotName: slot.slotName,
//           quoteDate: slot.quoteDate,
//           endDate: slot.endDate,
//           Products: slot.Products?.map((product) => ({
//             productId: product.productId,
//             productName: product.productName,
//             qty: product.qty || product.quantity,
//             price: product.price,
//             quantity: product.quantity || product.qty,
//             total: product.total,
//             StockAvailable: product.availableStock, // if needed
//           })) || [],
//         })) || [],
//       };

//       console.log("Updated Quotation details: ", updatedQuotationDetails);

//       // Make the API call to update the quotation
//       const response = await axios.put(
//         `${ApiURL}/quotations/updateQuotationOnOrder/${quotation._id}`,
//         updatedQuotationDetails
//       );

//       if (response.status === 200) {
//         console.log("Quotation updated successfully:", response.data.response);
//         await handleAddPayment()
//         // Optionally, update the state or show a success message
//       } else {
//         console.error("Failed to update the quotation. Response status:", response.status);
//       }
//     } catch (error) {
//       // Handle errors during the API call
//       console.error("Error updating quotation:", error?.response?.data?.error || error.message);
//     } finally {
//       handleCloseGenerateModal();
//     }
//   };

//   const handleGenerateOrder = async () => {
//     try {
//       // Prepare the order details from quotationDetails
//       const orderDetails = {
//         ClientId: quotation?.clientId,
//         clientNo: quotation?.clientNo,
//         GrandTotal: grandTotal,
//         paymentStatus: quotation?.paymentStatus,
//         clientName: quotation?.clientName,
//         executivename: quotation?.executivename,
//         Address: quotation?.address,
//         labourecharge: quotation?.labourecharge,
//         transportcharge: quotation?.transportcharge,
//         GST: quotation?.GST,
//         discount: quotation?.discount,
//         placeaddress: quotation?.placeaddress,
//         adjustments: quotation?.adjustments,
//         products: quotation?.slots?.map((slot) => ({
//           products: slot.Products?.map((product) => ({
//             productId: product.productId,
//             productName: product.productName,
//             quantity: product.quantity || product.qty,
//             total: product.total,
//           })),
//         })) || [], // Default to empty array if no slots found
//         slots: quotation?.slots?.map((slot) => ({
//           slotName: slot.slotName,
//           quoteDate: slot.quoteDate,
//           endDate: slot.endDate,
//           products: slot.Products?.map((product) => ({
//             productId: product.productId,
//             productName: product.productName,
//             quantity: product.quantity || product.qty,
//             total: product.total,
//           })),
//         })) || [], // Default to empty array if no slots found
//       };

//       console.log("orderdetails config: ", orderDetails)

//       // Make the API call to create the order
//       const response = await axios.post(
//         `${ApiURL}/order/postaddorder`,
//         orderDetails
//       );

//       // Check if the response is successful
//       if (response.status === 201) {
//         console.log("Order created successfully:", response.data.response);
//         // Optionally, update the state or show a success message
//         // Example: setOrderDetails(response.data);
//       } else {
//         console.error("Failed to create the order. Response status:", response.status);
//       }
//     } catch (error) {
//       // Handle errors during the API call
//       console.error("Error creating order:", error);
//     } finally {
//       handleCloseGenerateModal()
//     }
//   };

//   // console.log("selectedAddProduct: ", selectedAddProduct)
//   console.log("quotation: ", quotation)

//   if (loading) {
//     return (
//       <Container className="my-5 text-center">
//         <Spinner animation="border" />
//       </Container>
//     );
//   }

//   if (!quotation) {
//     return (
//       <Container className="my-5 text-center">
//         <h4>Quotation not found.</h4>
//       </Container>
//     );
//   }

//   // Helper: flatten slots/products for table
//   const items =
//     quotation.slots && Array.isArray(quotation.slots)
//       ? quotation.slots.flatMap((slot, slotIdx) =>
//         (slot.Products || []).map((prod, prodIdx) => {
//           // Calculate days (inclusive) from DD-MM-YYYY format
//           let days = 1;
//           if (slot.quoteDate && slot.endDate) {
//             const [d1, m1, y1] = slot.quoteDate.split("-");
//             const [d2, m2, y2] = slot.endDate.split("-");
//             const start = new Date(`${y1}-${m1}-${d1}`);
//             const end = new Date(`${y2}-${m2}-${d2}`);
//             days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
//             if (isNaN(days) || days < 1) days = 1;
//           }
//           return {
//             sNo: prodIdx + 1,
//             productId: prod.productId,
//             slotDate: [slot.quoteDate, slot.endDate],
//             productName: prod.productName || prod.name || "",
//             image: prod.ProductIcon,
//             units: prod.quantity || prod.qty,
//             days,
//             pricePerUnit: Number(prod.price) || 0,
//             amount: Number(prod.total) || 0,
//             available: prod.availableStock > 0 ? prod.availableStock : 0
//           };
//         })
//       )
//       : [];

//   const handleShowAdd = () => {
//     setShowAdd(true);
//     setAddProductId("");
//     setAddQty(1);
//     setSelectedAddProduct(null);
//   };
//   const handleCloseAdd = () => {
//     setShowAdd(false);
//     setAddProductId("");
//     setAddQty(1);
//     setSelectedAddProduct(null);
//   };

//   const addedProductIds = quotation?.slots
//     ? quotation.slots.flatMap(slot => (slot.Products || []).map(p => String(p.productId || p._id)))
//     : [];

//   const availableToAdd = allProducts.filter(
//     (p) => !addedProductIds.includes(String(p._id))
//   );

//   const handleAddProduct = async () => {
//     if (!selectedAddProduct || !addQty) return;

//     // Prepare new product object
//     const newProduct = {
//       productId: selectedAddProduct._id,
//       productName: selectedAddProduct.ProductName,
//       qty: addQty,
//       price: Number(selectedAddProduct.ProductPrice),
//       total: addQty * Number(selectedAddProduct.ProductPrice),
//       ProductIcon: selectedAddProduct.ProductIcon,
//       availableStock: selectedAddProduct.availableStock,
//     };

//     // Add to first slot (or create slot if none)
//     const updatedSlots = quotation.slots && quotation.slots.length > 0
//       ? quotation.slots.map((slot, idx) =>
//         idx === 0
//           ? { ...slot, Products: [...(slot.Products || []), newProduct] }
//           : slot
//       )
//       : [{
//         slotName: "Default Slot",
//         Products: [newProduct],
//         quoteDate: quotation.quoteDate,
//         endDate: quotation.endDate,
//       }];

//     // try {
//     //   // Update on backend
//     //   const res = await axios.put(`${ApiURL}/quotations/updateProducts/${quotation._id}`, {
//     //     slots: updatedSlots,
//     //   });
//     //   if (res.status === 200) {
//     setQuotation({ ...quotation, slots: updatedSlots });
//     setShowAdd(false)
//     //     handleCloseAdd();
//     //   }
//     // } catch (err) {
//     //   alert("Failed to add product");
//     // }
//   };

//   // console.log("select add: ", selectedAddProduct)

//   const handleProductSelect = async (selected) => {
//     if (selected) {
//       const productId = selected.value;
//       setAddProductId(productId);
//       setAddQty(1);

//       const productObj = allProducts.find(p => String(p._id) === String(productId));

//       try {
//         const res = await axios.post(
//           `${ApiURL}/inventory/product/filter/${productId}`,
//           {},
//           {
//             params: {
//               startDate: items[0].slotDate[0],
//               endDate: items[0].slotDate[1],
//               productId,
//             },
//           }
//         );

//         console.log("inventory/product/filter res.data: ", res.data)

//         if (res.data?.availableStock) {
//           console.log("res.data?.avaiableStock")
//           setSelectedAddProduct({
//             ...productObj,
//             availableStock: res.data.availableStock,
//           });
//         } else {
//           setSelectedAddProduct(null);
//         }

//       } catch (error) {
//         console.error("Error fetching product:", error);
//         setSelectedAddProduct(null);
//       }
//     } else {
//       // Handle clearing
//       setAddProductId("");
//       setSelectedAddProduct(null);
//       setAddQty(0);
//     }
//   };

//   // const allProductsAmount = quotation?.products?.reduce(
//   //   (sum, p) => sum + (p.qty * p.price),
//   //   0
//   // );

//   // Calculate subtotal from all items
//   const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);

//   // Use values from quotation or 0 if not present
//   const discount = Number(quotation?.discount || 0);
//   const transport = Number(quotation?.transportcharge || 0);
//   const manpower = Number(quotation?.labourecharge || 0);
//   const roundOff = Number(quotation?.adjustments || quotation?.roundOff || 0);
//   const gst = Number(quotation.GST || 0);

//   // Add transport and manpower
//   const afterCharges = subtotal + transport + manpower;

//   // Calculate after discount
//   const discountAmt = afterCharges * (discount / 100);
//   const afterDiscount = afterCharges - discountAmt;

//   // GST calculation (if GST is a percentage)
//   const gstAmt = afterDiscount * (gst / 100);

//   // Grand total
//   const grandTotal = Math.round(afterDiscount + gstAmt);

//   // setGrandTotal(Math.round(afterDiscount + gstAmt));


//   // console.log({
//   //   subtotal,
//   //   discount,
//   //   transport,
//   //   manpower,
//   //   // roundOff,
//   //   // gst,
//   //   discountAmt,
//   //   afterDiscount,
//   //   afterCharges,
//   //   // gstAmt,
//   //   // grandTotal
//   // });

//   const handleEdit = (idx, qty) => {
//     setEditIdx(idx);
//     setEditQty(qty);
//   };

//   // // Save the new qty (with API call)
//   // const handleEditSave = async (item) => {
//   //   if (editQty < 1 || editQty > item.available) {
//   //     toast.error("Quantity must be between 1 and available stock!");
//   //     return;
//   //   }
//   //   setLoading(true);
//   //   try {
//   //     await axios.put(
//   //       `${ApiURL}/Enquiry/update-product-data/${quotation.enquiryId}`,
//   //       { productId: item.productId, quantity: editQty, price: item.pricePerUnit, productName:item.productName }
//   //     );
//   //     await handleEditSaveInQuotaion()
//   //     toast.success("Quantity updated!");
//   //     setEditIdx(null);
//   //     setEditQty(1);
//   //     // fetchEnquiry();
//   //   } catch (err) {
//   //     console.log("err: ", err.response.data.error)
//   //     toast.error("Failed to update quantity: ", err);
//   //   }
//   //   setLoading(false);
//   // };

//   // // Delete a product (with API call)
//   // const handleDelete = async (item) => {
//   //   if (!window.confirm("Delete this product?")) return;
//   //   setLoading(true);
//   //   try {
//   //     await axios.delete(
//   //       `${ApiURL}/Enquiry/delete-product-data/${quotation.enquiryId}`,
//   //       { data: { productId: item.productId } }
//   //     );
//   //     await handleDeleteInQuotaion
//   //     toast.success("Product deleted!");
//   //     // fetchEnquiry();
//   //   } catch (err) {
//   //     toast.error("Failed to delete product");
//   //   }
//   //   setLoading(false);
//   // };

//   // Save the new qty (with API call)
//   const handleEditSave = async (item) => {
//     if (editQty < 1 || editQty > item.available) {
//       toast.error("Quantity must be between 1 and less than available stock!");
//       return;
//     }
//     // Update the quantity in the correct slot/product in local state
//     const updatedSlots = quotation.slots.map((slot) => ({
//       ...slot,
//       Products: (slot.Products || []).map((prod) =>
//         prod.productId === item.productId
//           ? {
//             ...prod,
//             qty: editQty,
//             quantity: editQty,
//             total: (editQty * (prod.price || item.pricePerUnit)),
//           }
//           : prod
//       ),
//     }));

//     setQuotation({ ...quotation, slots: updatedSlots });
//     setEditIdx(null);
//     setEditQty(1);
//   };

//   // Delete a product (with API call)
//   const handleDelete = async (item) => {
//     if (!window.confirm("Delete this product?")) return;
//     setLoading(true);

//   };

//   return (
//     <Container
//       className="my-5"
//       style={{ maxWidth: "1000px", fontFamily: "'Roboto', sans-serif" }}
//     >
//       {/* Header with Logo and Title */}
//       <div className="d-flex align-items-center mb-4">
//         <img
//           src={logo}
//           alt="Company Logo"
//           style={{ height: "50px", marginRight: "20px" }}
//         />
//         <div>
//           <h2 className="mb-0" style={{ color: "#2c3e50", fontWeight: "600" }}>
//             Quotation
//           </h2>
//           <p className="text-muted mb-0">NNC Event Rentals</p>
//         </div>
//         <Button
//           variant="primary"
//           className="ms-auto"
//           style={{
//             background: "linear-gradient(45deg, #3498db, #2980b9)",
//             border: "none",
//             borderRadius: "8px",
//             padding: "10px 20px",
//             fontWeight: "500",
//             transition: "transform 0.2s",
//           }}
//           onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
//           onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
//         >
//           Download as PDF
//         </Button>
//       </div>

//       {/* Company and Event Details */}
//       <Card className="mb-4 shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
//         <Card.Body className="p-4">
//           <Table borderless size="sm">
//             <tbody>
//               <tr>
//                 <td style={{ width: "25%", fontWeight: "500", color: "#34495e" }}>
//                   Company Name
//                 </td>
//                 <td style={{ width: "25%" }}>
//                   {(quotation.clientName || "").toUpperCase()}
//                 </td>
//                 <td style={{ width: "25%", fontWeight: "500", color: "#34495e" }}>
//                   Contact Number
//                 </td>
//                 <td style={{ width: "25%" }}>{quotation.clientNo || ""}</td>
//               </tr>
//               <tr>
//                 <td style={{ fontWeight: "500", color: "#34495e" }}>
//                   Executive Name
//                 </td>
//                 <td>{quotation.executivename || ""}</td>
//                 <td style={{ fontWeight: "500", color: "#34495e" }}>Venue</td>
//                 <td>{quotation.placeaddress || ""}</td>
//               </tr>
//               <tr>
//                 <td style={{ fontWeight: "500", color: "#34495e" }}>
//                   Delivery Date
//                 </td>
//                 <td>{quotation.quoteDate || ""}</td>
//                 <td style={{ fontWeight: "500", color: "#34495e" }}>
//                   End Date
//                 </td>
//                 <td>{quotation.endDate || ""}</td>
//               </tr>
//               <tr>
//                 <td style={{ fontWeight: "500", color: "#34495e" }}>
//                   Address
//                 </td>
//                 <td>{quotation.address || ""}</td>
//                 <td style={{ fontWeight: "500", color: "#34495e" }}>
//                   Status
//                 </td>
//                 <td>{quotation.status || ""}</td>
//               </tr>
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>

//       {/* Items Table */}
//       <Card className="mb-4 shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
//         <Card.Body className="p-4">
//           <Table
//             bordered
//             size="sm"
//             style={{ borderColor: "#e0e0e0" }}
//             className="mb-0"
//           >
//             <thead
//               style={{
//                 background: "linear-gradient(45deg, #34495e, #2c3e50)",
//                 color: "#fff",
//               }}
//             >
//               <tr>
//                 <th>Slot Date</th>
//                 <th style={{width:"25%"}}>Product</th>
//                 <th>Image</th>
//                 <th>Available</th>
//                 <th>Qty</th>
//                 <th>Days</th>
//                 <th>Price/Qty</th>
//                 <th>Total</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, idx) => (
//                 <tr key={idx}>
//                   <td style={{ padding: "12px", verticalAlign: "middle" }}>
//                     {item.slotDate.map((d, i) => (
//                       <div key={i}>{d}</div>
//                     ))}
//                   </td>
//                   <td style={{ padding: "12px", verticalAlign: "middle" }}>
//                     {item.productName}
//                   </td>
//                   <td
//                     style={{
//                       padding: "12px",
//                       verticalAlign: "middle",
//                       textAlign: "center",
//                     }}
//                   >
//                     <img
//                       src={
//                         item.image
//                           ? `http://api.rentangadi.in/product/${item.image}`
//                           : "https://cdn-icons-png.flaticon.com/512/1532/1532801.png"
//                       }
//                       alt="element"
//                       style={{
//                         width: 50,
//                         height: 50,
//                         objectFit: "contain",
//                         borderRadius: "4px",
//                       }}
//                     />
//                   </td>
//                   <td style={{ padding: "12px", verticalAlign: "middle" }}>
//                     {item.available}
//                   </td>
//                   <td style={{ padding: "12px", verticalAlign: "middle" }}>
//                     {editIdx === idx ? (
//                       <Form.Control
//                         type="number"
//                         min={1}
//                         max={item.available}
//                         value={editQty}
//                         onChange={(e) => {
//                           let val = e.target.value.replace(/^0+/, "");
//                           setEditQty(
//                             val === ""
//                               ? ""
//                               : Math.max(
//                                 1,
//                                 Math.min(Number(val), item.available)
//                               )
//                           );
//                         }}
//                         style={{ width: 70, padding: "2px 6px", fontSize: 13 }}
//                         autoFocus
//                         disabled={loading}
//                       />
//                     ) : (
//                       item.units
//                     )}
//                   </td>
//                   {/* {console.log("item: ", item)} */}
//                   <td style={{ padding: "12px", verticalAlign: "middle" }}>
//                     {item.days}
//                   </td>
//                   <td style={{ padding: "12px", verticalAlign: "middle" }}>
//                     ₹{item.pricePerUnit?.toLocaleString()}
//                   </td>
//                   <td style={{ padding: "12px", verticalAlign: "middle" }}>
//                     ₹
//                     {item.amount?.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                     })}
//                   </td>
//                   <td style={{ padding: "12px", verticalAlign: "middle" }}>
//                     {editIdx === idx ? (
//                       <>
//                         <Button
//                           variant="success"
//                           size="sm"
//                           style={{ padding: "2px 6px", marginRight: 4 }}
//                           onClick={() => handleEditSave(item)}
//                           disabled={loading}
//                         >
//                           <FaCheck />
//                         </Button>
//                         <Button
//                           variant="secondary"
//                           size="sm"
//                           style={{ padding: "2px 6px" }}
//                           onClick={() => setEditIdx(null)}
//                           disabled={loading}
//                         >
//                           <FaTimes />
//                         </Button>
//                       </>
//                     ) : (
//                       <>
//                         <Button
//                           variant="link"
//                           size="sm"
//                           style={{ color: "#157347", padding: 0 }}
//                           onClick={() => handleEdit(idx, item.units)}
//                           disabled={loading}
//                         >
//                           <FaEdit />
//                         </Button>
//                         <Button
//                           variant="link"
//                           size="sm"
//                           style={{ color: "#d00", padding: 0, marginLeft: 8 }}
//                           onClick={() => handleDelete(item)}
//                           disabled={loading}
//                         >
//                           <FaTrashAlt />
//                         </Button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>

//       {/* Cost Summary */}
//       <Card className="mb-4 shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
//         <Card.Body className="p-4">
//           <h5 style={{ fontWeight: "600", color: "#2c3e50", marginBottom: "20px" }}>
//             Cost Summary
//           </h5>
//           <div className="d-flex justify-content-between mb-2">
//             <span>Discount(%):</span>
//             <span>{(quotation.discount || 0).toFixed(2)}</span>
//           </div>
//           <div className="d-flex justify-content-between mb-2">
//             <span>Transportation:</span>
//             <span>₹{(quotation.transportcharge || 0).toFixed(2)}</span>
//           </div>
//           <div className="d-flex justify-content-between mb-2">
//             <span>Manpower Charge:</span>
//             <span>₹{(quotation.labourecharge || 0).toFixed(2)}</span>
//           </div>
//           <div className="d-flex justify-content-between mb-2">
//             <span style={{ fontWeight: "600" }}>Subtotal:</span>
//             <span style={{ fontWeight: "600" }}>
//               ₹
//               {/* {items
//                 .reduce((sum, item) => sum + (item.amount || 0), 0)
//                 .toLocaleString(undefined, { minimumFractionDigits: 2 })} */}
//               {items
//                 .reduce((sum, item) => sum + (item.amount || 0), 0)
//                 .toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </span>
//           </div>
//           <div className="d-flex justify-content-between mb-2">
//             <span>Round Off:</span>
//             <span>₹{(quotation.adjustments || quotation.roundOff || 0).toFixed(2)}</span>
//           </div>
//           <div className="d-flex justify-content-between mb-2">
//             <span>GST(%):</span>
//             <span>{(quotation.GST || 0).toFixed(2)}</span>
//           </div>
//           <hr style={{ borderColor: "#e0e0e0" }} />
//           <div
//             className="d-flex justify-content-between"
//             style={{ fontSize: "18px", fontWeight: "700", color: "#34495e" }}
//           >
//             <span>Grand Total:</span>
//             {/* <span>
//               ₹
//               {(quotation.GrandTotal || quotation.grandTotal || 0).toLocaleString(undefined, {
//                 minimumFractionDigits: 2,
//               })}
//             </span> */}
//             <span>
//               ₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </span>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Notes */}
//       {quotation.termsandCondition && quotation.termsandCondition.length > 0 && (
//         <Card className="mb-4 shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
//           <Card.Body className="p-4">
//             <h5 style={{ fontWeight: "600", color: "#2c3e50", marginBottom: "15px" }}>
//               Terms and Notes
//             </h5>
//             <ul style={{ paddingLeft: "20px", color: "#333", lineHeight: "1.6" }}>
//               {quotation.termsandCondition.map((note, idx) => (
//                 <li key={idx} style={{ marginBottom: "10px" }}>
//                   {note}
//                 </li>
//               ))}
//             </ul>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Action Buttons */}
//       <Card className="mb-4 shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
//         <Card.Body className="p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
//           <Button
//             variant="primary"
//             style={{
//               background: "linear-gradient(45deg, #2980b9, #3498db)",
//               border: "none",
//               borderRadius: "8px",
//               padding: "10px 20px",
//               fontWeight: "500",
//               transition: "transform 0.2s",
//             }}
//             onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
//             onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
//             onClick={handleShowGenerateModal}
//           >
//             Generate Order
//           </Button>
//           <Button
//             variant="info"
//             style={{
//               background: "linear-gradient(45deg, #27ae60, #2ecc71)",
//               border: "none",
//               borderRadius: "8px",
//               padding: "10px 20px",
//               fontWeight: "500",
//               transition: "transform 0.2s",
//               color: "white",
//             }}
//             onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
//             onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
//             onClick={handleShowAdd}
//           >
//             Add Product
//           </Button>
//           <Button
//             variant="danger"
//             style={{
//               background: "linear-gradient(45deg, #c0392b, #e74c3c)",
//               border: "none",
//               borderRadius: "8px",
//               padding: "10px 20px",
//               fontWeight: "500",
//               transition: "transform 0.2s",
//             }}
//             onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
//             onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
//             // onClick={() => alert("Cancel Order clicked")}
//             onClick={() => handleGenerateOrder()}
//           >
//             Cancel Order
//           </Button>
//         </Card.Body>
//       </Card>
//       {/* Add Payment Modal */}
//       <Modal show={showGenerateModal} onHide={handleCloseGenerateModal} centered>
//         <Modal.Header style={{ borderBottom: "none", padding: "20px 20px 0" }}>
//           <Modal.Title style={{ fontWeight: "600", color: "#2c3e50" }}>
//             Payment
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ padding: "20px" }}>
//           <Form>
//             {/* Payment Status */}
//             <Form.Group className="mb-3">
//               <Form.Label style={{ fontWeight: "500", color: "#34495e" }}>
//                 Payment
//               </Form.Label>
//               <div>
//                 <Form.Check
//                   inline
//                   label="Offline"
//                   type="checkbox"
//                   checked={paymentData.status === "Offline"}
//                   onChange={() => handleCheckboxChange("Offline")}
//                   style={{ marginRight: "20px" }}
//                 />
//                 <Form.Check
//                   inline
//                   label="Online"
//                   type="checkbox"
//                   checked={paymentData.status === "Online"}
//                   onChange={() => handleCheckboxChange("Online")}
//                 />
//               </div>
//             </Form.Group>
//             {/* Amount */}
//             <Form.Group className="mb-3">
//               <Form.Label style={{ fontWeight: "500", color: "#34495e" }}>
//                 Amount
//               </Form.Label>
//               <div className="d-flex align-items-center">
//                 <span
//                   style={{
//                     marginRight: "10px",
//                     fontSize: "1.2rem",
//                     color: "#34495e",
//                   }}
//                 >
//                   ₹
//                 </span>
//                 <Form.Control
//                   type="number"
//                   name="amount"
//                   value={paymentData.amount}
//                   max={quotation?.GrandTotal}
//                   onChange={handleInputChange}
//                   placeholder="0"
//                   style={{ borderRadius: "6px", borderColor: "#e0e0e0" }}
//                 />
//               </div>
//             </Form.Group>
//             {/* Payment Mode */}{paymentData.status !== 'Offline' && (
//               <Form.Group className="mb-3">
//                 <Form.Label style={{ fontWeight: "500", color: "#34495e" }}>
//                   Payment Mode
//                 </Form.Label>
//                 <Form.Select
//                   name="mode"
//                   value={paymentData.mode}
//                   onChange={handleInputChange}
//                   style={{ borderRadius: "6px", borderColor: "#e0e0e0" }}
//                 >
//                   <option value="">Select Payment Mode</option>
//                   <option value="Googlepay">Googlepay</option>
//                   <option value="Phonepay">Phonepay</option>
//                   <option value="Paytm">Paytm</option>
//                   <option value="UPI">UPI</option>
//                 </Form.Select>
//               </Form.Group>
//             )}
//             {/* Comments */}
//             <Form.Group className="mb-3">
//               <Form.Label style={{ fontWeight: "500", color: "#34495e" }}>
//                 Comments
//               </Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="comments"
//                 value={paymentData.comments}
//                 onChange={handleInputChange}
//                 placeholder="Add any comments or remarks"
//                 style={{
//                   borderRadius: "6px",
//                   borderColor: "#e0e0e0",
//                   resize: "none",
//                 }}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer style={{ borderTop: "none", padding: "0 20px 20px" }}>
//           <Button
//             style={{
//               background: "linear-gradient(45deg, #27ae60, #2ecc71)",
//               border: "none",
//               borderRadius: "8px",
//               padding: "6px 10px",
//               fontWeight: "500",
//               transition: "transform 0.2s",
//               width: "100px",
//             }}
//             className="btn-sm"
//             onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
//             onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
//             // onClick={handleAddPayment}
//             onClick={handleUpdateQuotation}

//           >
//             Add
//           </Button>
//           <Button
//             style={{
//               background: "linear-gradient(45deg, #2980b9, #3498db)",
//               border: "none",
//               borderRadius: "8px",
//               padding: "6px 20px",
//               fontWeight: "500",
//               transition: "transform 0.2s",
//             }}
//             className="btn-sm"
//             onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
//             onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
//             onClick={handleGenerateOrder}
//           >
//             Skip
//           </Button>
//           <Button
//             style={{
//               background: "linear-gradient(45deg,rgb(185, 41, 72), #3498db)",
//               border: "none",
//               borderRadius: "8px",
//               padding: "6px 20px",
//               fontWeight: "500",
//               transition: "transform 0.2s",
//             }}
//             className="btn-sm"
//             onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
//             onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
//             onClick={handleCloseGenerateModal}
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* add product  */}
//       <Modal show={showAdd} onHide={handleCloseAdd} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Add Product</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3" controlId="addProductSelect">
//               <Form.Label>Product Name</Form.Label>
//               <Select
//                 options={availableToAdd.map((p) => ({
//                   value: p._id,
//                   label: p.ProductName,
//                 }))}
//                 value={
//                   addProductId
//                     ? availableToAdd
//                       .map((p) => ({ value: p._id, label: p.ProductName }))
//                       .find((opt) => String(opt.value) === String(addProductId))
//                     : null
//                 }
//                 onChange={handleProductSelect}
//                 isClearable
//                 placeholder="Search product..."
//               />
//             </Form.Group>
//             <Row>
//               <Col xs={6}>
//                 <Form.Group className="mb-3" controlId="addProductStock">
//                   <Form.Label>Available Stock</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={
//                       selectedAddProduct ? selectedAddProduct.availableStock : 0
//                     }
//                     disabled
//                   />
//                 </Form.Group>
//               </Col>
//               <Col xs={6}>
//                 <Form.Group className="mb-3" controlId="addProductQty">
//                   <Form.Label>Quantity</Form.Label>
//                   <Form.Control
//                     type="number"
//                     min={1}
//                     max={selectedAddProduct?.availableStock || 1}
//                     value={addQty}
//                     disabled={!addProductId}
//                     onChange={(e) => {
//                       let val = e.target.value.replace(/^0+/, "");
//                       let qty = val === "" ? "" : Math.max(1, Number(val));
//                       if (
//                         selectedAddProduct &&
//                         qty > selectedAddProduct.availableStock
//                       ) {
//                         qty = selectedAddProduct.availableStock;
//                       }
//                       setAddQty(qty);
//                     }}
//                   />
//                   {selectedAddProduct && addQty > selectedAddProduct.availableStock && (
//                     <div style={{ color: "red", fontSize: 12 }}>
//                       Cannot exceed available stock ({selectedAddProduct.availableStock})
//                     </div>
//                   )}
//                 </Form.Group>
//               </Col>
//               <Col xs={6}>
//                 <Form.Group className="mb-3" controlId="addProductPrice">
//                   <Form.Label>Price</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={`₹${selectedAddProduct ? selectedAddProduct.ProductPrice : 0}`}
//                     disabled
//                   />
//                 </Form.Group>
//               </Col>
//               <Col xs={6}>
//                 <Form.Group className="mb-3" controlId="addProductTotal">
//                   <Form.Label>Total Price</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={
//                       selectedAddProduct
//                         ? `₹${(addQty ? addQty : 1) * selectedAddProduct.ProductPrice}`
//                         : "₹0"
//                     }
//                     disabled
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="primary"
//             size="sm"
//             disabled={
//               !addProductId ||
//               !addQty ||
//               addQty < 1 ||
//               (selectedAddProduct && addQty > selectedAddProduct.availableStock)
//             }
//             onClick={handleAddProduct}
//           >
//             Add
//           </Button>
//         </Modal.Footer>
//       </Modal>

//     </Container>
//   );
// };

// export default QuotationDetails;


import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Card,
  Container,
  Row,
  Form,
  Table,
  Modal,
  Spinner,
} from "react-bootstrap";
import logo from "../../assets/RentangadiLogo.jpg";
import { useFetcher, useParams } from "react-router-dom";
import axios from "axios";
import { ApiURL, ImageApiURL } from "../../api";
import Select from "react-select";
import {
  FaEdit,
  FaTrashAlt,
  FaUser,
  FaBuilding,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { toast } from 'react-hot-toast'

const QuotationDetails = () => {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    status: "Online",
    amount: 0,
    mode: "",
    comments: "",
    date: new Date().toLocaleDateString("en-GB").split("/").join("-"),
  });
  const [showAdd, setShowAdd] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [addProductId, setAddProductId] = useState("");
  const [addQty, setAddQty] = useState(1);
  const [selectedAddProduct, setSelectedAddProduct] = useState(null);
  const [getPayment, setGetPayment] = useState("")
  const [editIdx, setEditIdx] = useState(null);
  const [editQty, setEditQty] = useState(1);


  // const [grandTotal, setGrandTotal] = useState(0)

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(`${ApiURL}/product/quoteproducts`);
      // console.log("fetch prods: ", res.data)
      if (res.status === 200) {
        setAllProducts(res.data.QuoteProduct || []);
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  useEffect(() => {
    fetchAllProducts()
  }, [])

  useEffect(() => {
    const fetchQuotation = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${ApiURL}/quotations/getquotation/${id}`);
        console.log("getquotation/ quoteData: ", res.data.quoteData)
        // console.log("quoteData slots", res.data.quoteData.slots)
        setQuotation(res.data.quoteData);
      } catch (error) {
        setQuotation(null);
      }
      setLoading(false);
    };
    fetchQuotation();
  }, [id]);

  const handleShowGenerateModal = () => setShowGenerateModal(true);
  const handleCloseGenerateModal = () => setShowGenerateModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (status) => {
    setPaymentData((prev) => ({ ...prev, status }));
  };

  const handleAddPayment = async () => {
    try {
      // First, make the API call to fetch payment data
      const orderDetails = {
        quotationId: quotation?._id,
        totalAmount: quotation?.GrandTotal,
        advancedAmount: paymentData.amount,
        paymentMode: paymentData.status, // Send selected payment mode
        paymentRemarks: paymentData.status === "Offline" ? "cash" : paymentData.mode,
        comment: paymentData.comments,
        status: "Completed",
      };

      // Make the POST request to add payment
      const response = await axios.post(
        "https://api.rentangadi.in/api/payment/",
        orderDetails
      );


      // // If the API call is successful, update the payment data state
      if (response.status === 200) {
        console.log("payment successful: ", response.data)
        // await handleUpdateQuotation()
        await handleGenerateOrder()
        setGetPayment(response.data);
      }
      console.log("payment details: ", orderDetails)

      // Then, update the quotation state with the new payment details
      // setQuotation((prev) => ({
      //   ...prev,
      //   payments: [
      //     ...(prev.payments || []),
      //     {
      //       date: paymentData.date,
      //       amount: parseFloat(paymentData.amount),
      //       status: paymentData.status,
      //       mode: paymentData.mode,
      //     },
      //   ],
      //   remainingAmount:
      //     (prev.remainingAmount || 0) - parseFloat(paymentData.amount),
      // }));

      // Reset paymentData after the payment is added
      // setPaymentData({
      //   status: "Online",
      //   amount: 0,
      //   mode: "",
      //   comments: "",
      //   date: new Date().toLocaleDateString("en-GB").split("/").join("-"),
      // });

      // Close the modal after the action

    } catch (error) {
      console.error("Error fetching payment data:", error);
      // Optionally handle any errors that occur during the API request
    } finally {
      handleCloseGenerateModal();
    }
  };

  // const handleUpdateQuotation = async () => {
  //   try {
  //     // Prepare the updated quotation details
  //     const updatedQuotationDetails = {
  //       enquiryId: quotation.enquiryId,
  //       GrandTotal: grandTotal, // updated GrandTotal
  //       status: quotation?.status, // You can set status to 'updated' or other if needed
  //       slots: quotation?.slots?.map((slot) => ({
  //         slotName: slot.slotName,
  //         quoteDate: slot.quoteDate,
  //         endDate: slot.endDate,
  //         Products: slot.Products?.map((product) => ({
  //           productId: product.productId,
  //           productName: product.productName,
  //           quantity: product.quantity || product.qty,
  //           total: product.total, // Recalculate total if needed
  //         })) || [],
  //       })) || [], // Default to empty array if no slots found
  //     };

  //     console.log("Updated Quotation details: ", updatedQuotationDetails);

  //     // Make the API call to update the quotation
  //     const response = await axios.put(
  //       `${ApiURL}/quotations/updateQuotationOnOrder/${quotation._id}`,  // Adjust the URL based on your API
  //       updatedQuotationDetails
  //     );

  //     // Check if the response is successful
  //     if (response.status === 200) {
  //       console.log("Quotation updated successfully:", response.data.response);
  //       // Optionally, update the state or show a success message
  //       // Example: setQuotationDetails(response.data.response);
  //     } else {
  //       console.error("Failed to update the quotation. Response status:", response.status);
  //     }
  //   } catch (error) {
  //     // Handle errors during the API call
  //     console.error("Error updating quotation:", error.data.error);
  //   } finally {
  //     handleCloseGenerateModal(); // Close the modal or perform any final actions
  //   }
  // };

  const handleUpdateQuotation = async () => {
    try {
      // Flatten all products from all slots for the Products array
      const allProducts = quotation?.slots
        ? quotation.slots.flatMap(slot =>
          (slot.Products || []).map(product => ({
            productId: product.productId,
            productName: product.productName,
            qty: product.qty || product.quantity,
            price: product.price,
            quantity: product.quantity || product.qty,
            total: product.total,
            StockAvailable: product.availableStock, // if needed by backend
          }))
        )
        : [];

      // Prepare the updated quotation details
      const updatedQuotationDetails = {
        enquiryObjectId: quotation._id, // Add this if your backend expects it
        enquiryId: quotation.enquiryId,
        GrandTotal: grandTotal, // updated GrandTotal
        status: quotation?.status,
        Products: allProducts, // Flat array for backend update logic
        slots: quotation?.slots?.map((slot) => ({
          slotName: slot.slotName,
          quoteDate: slot.quoteDate,
          endDate: slot.endDate,
          Products: slot.Products?.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            qty: product.qty || product.quantity,
            price: product.price,
            quantity: product.quantity || product.qty,
            total: product.total,
            StockAvailable: product.availableStock, // if needed
          })) || [],
        })) || [],
      };

      console.log("Updated Quotation details: ", updatedQuotationDetails);

      // Make the API call to update the quotation
      const response = await axios.put(
        `${ApiURL}/quotations/updateQuotationOnOrder/${quotation._id}`,
        updatedQuotationDetails
      );

      if (response.status === 200) {
        console.log("Quotation updated successfully:", response.data.response);
        await handleAddPayment()
        // Optionally, update the state or show a success message
      } else {
        console.error("Failed to update the quotation. Response status:", response.status);
      }
    } catch (error) {
      // Handle errors during the API call
      console.error("Error updating quotation:", error?.response?.data?.error || error.message);
    } finally {
      handleCloseGenerateModal();
    }
  };

  const handleGenerateOrder = async () => {
    try {
      // Prepare the order details from quotationDetails
      const orderDetails = {
        ClientId: quotation?.clientId,
        clientNo: quotation?.clientNo,
        GrandTotal: grandTotal,
        paymentStatus: quotation?.paymentStatus,
        clientName: quotation?.clientName,
        executivename: quotation?.executivename,
        Address: quotation?.address,
        labourecharge: quotation?.labourecharge,
        transportcharge: quotation?.transportcharge,
        GST: quotation?.GST,
        discount: quotation?.discount,
        placeaddress: quotation?.placeaddress,
        adjustments: quotation?.adjustments,
        products: quotation?.slots?.map((slot) => ({
          products: slot.Products?.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            quantity: product.quantity || product.qty,
            total: product.total,
          })),
        })) || [], // Default to empty array if no slots found
        slots: quotation?.slots?.map((slot) => ({
          slotName: slot.slotName,
          quoteDate: slot.quoteDate,
          endDate: slot.endDate,
          products: slot.Products?.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            quantity: product.quantity || product.qty,
            total: product.total,
          })),
        })) || [], // Default to empty array if no slots found
      };

      console.log("orderdetails config: ", orderDetails)

      // Make the API call to create the order
      const response = await axios.post(
        `${ApiURL}/order/postaddorder`,
        orderDetails
      );

      // Check if the response is successful
      if (response.status === 201) {
        console.log("Order created successfully:", response.data.response);
        // Optionally, update the state or show a success message
        // Example: setOrderDetails(response.data);
      } else {
        console.error("Failed to create the order. Response status:", response.status);
      }
    } catch (error) {
      // Handle errors during the API call
      console.error("Error creating order:", error);
    } finally {
      handleCloseGenerateModal()
    }
  };

  // console.log("selectedAddProduct: ", selectedAddProduct)
  console.log("quotation: ", quotation)

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!quotation) {
    return (
      <Container className="my-5 text-center">
        <h4>Quotation not found.</h4>
      </Container>
    );
  }

  // Helper: flatten slots/products for table
  const items =
    quotation.slots && Array.isArray(quotation.slots)
      ? quotation.slots.flatMap((slot, slotIdx) =>
        (slot.Products || []).map((prod, prodIdx) => {
          // Calculate days (inclusive) from DD-MM-YYYY format
          let days = 1;
          if (slot.quoteDate && slot.endDate) {
            const [d1, m1, y1] = slot.quoteDate.split("-");
            const [d2, m2, y2] = slot.endDate.split("-");
            const start = new Date(`${y1}-${m1}-${d1}`);
            const end = new Date(`${y2}-${m2}-${d2}`);
            days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
            if (isNaN(days) || days < 1) days = 1;
          }
          return {
            sNo: prodIdx + 1,
            productId: prod.productId,
            slotDate: [slot.quoteDate, slot.endDate],
            productName: prod.productName || prod.name || "",
            image: prod.ProductIcon,
            units: prod.quantity || prod.qty,
            days,
            pricePerUnit: Number(prod.price) || 0,
            amount: Number(prod.total) || 0,
            available: prod.availableStock > 0 ? prod.availableStock : 0
          };
        })
      )
      : [];

  const handleShowAdd = () => {
    setShowAdd(true);
    setAddProductId("");
    setAddQty(1);
    setSelectedAddProduct(null);
  };
  const handleCloseAdd = () => {
    setShowAdd(false);
    setAddProductId("");
    setAddQty(1);
    setSelectedAddProduct(null);
  };

  const addedProductIds = quotation?.slots
    ? quotation.slots.flatMap(slot => (slot.Products || []).map(p => String(p.productId || p._id)))
    : [];

  const availableToAdd = allProducts.filter(
    (p) => !addedProductIds.includes(String(p._id))
  );

  const handleAddProduct = async () => {
    if (!selectedAddProduct || !addQty) return;

    // Prepare new product object
    const newProduct = {
      productId: selectedAddProduct._id,
      productName: selectedAddProduct.ProductName,
      qty: addQty,
      price: Number(selectedAddProduct.ProductPrice),
      total: addQty * Number(selectedAddProduct.ProductPrice),
      ProductIcon: selectedAddProduct.ProductIcon,
      availableStock: selectedAddProduct.availableStock,
    };

    // Add to first slot (or create slot if none)
    const updatedSlots = quotation.slots && quotation.slots.length > 0
      ? quotation.slots.map((slot, idx) =>
        idx === 0
          ? { ...slot, Products: [...(slot.Products || []), newProduct] }
          : slot
      )
      : [{
        slotName: "Default Slot",
        Products: [newProduct],
        quoteDate: quotation.quoteDate,
        endDate: quotation.endDate,
      }];

    // try {
    //   // Update on backend
    //   const res = await axios.put(`${ApiURL}/quotations/updateProducts/${quotation._id}`, {
    //     slots: updatedSlots,
    //   });
    //   if (res.status === 200) {
    setQuotation({ ...quotation, slots: updatedSlots });
    setShowAdd(false)
    //     handleCloseAdd();
    //   }
    // } catch (err) {
    //   alert("Failed to add product");
    // }
  };

  // console.log("select add: ", selectedAddProduct)

  const handleProductSelect = async (selected) => {
    if (selected) {
      const productId = selected.value;
      setAddProductId(productId);
      setAddQty(1);

      const productObj = allProducts.find(p => String(p._id) === String(productId));

      try {
        const res = await axios.post(
          `${ApiURL}/inventory/product/filter/${productId}`,
          {},
          {
            params: {
              startDate: items[0].slotDate[0],
              endDate: items[0].slotDate[1],
              productId,
            },
          }
        );

        console.log("inventory/product/filter res.data: ", res.data)

        if (res.data?.availableStock) {
          console.log("res.data?.avaiableStock")
          setSelectedAddProduct({
            ...productObj,
            availableStock: res.data.availableStock,
          });
        } else {
          setSelectedAddProduct(null);
        }

      } catch (error) {
        console.error("Error fetching product:", error);
        setSelectedAddProduct(null);
      }
    } else {
      // Handle clearing
      setAddProductId("");
      setSelectedAddProduct(null);
      setAddQty(0);
    }
  };

  // const allProductsAmount = quotation?.products?.reduce(
  //   (sum, p) => sum + (p.qty * p.price),
  //   0
  // );

  // Calculate subtotal from all items
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);

  // Use values from quotation or 0 if not present
  const discount = Number(quotation?.discount || 0);
  const transport = Number(quotation?.transportcharge || 0);
  const manpower = Number(quotation?.labourecharge || 0);
  const roundOff = Number(quotation?.adjustments || quotation?.roundOff || 0);
  const gst = Number(quotation.GST || 0);

  // Add transport and manpower
  const afterCharges = subtotal + transport + manpower;

  // Calculate after discount
  const discountAmt = afterCharges * (discount / 100);
  const afterDiscount = afterCharges - discountAmt;

  // GST calculation (if GST is a percentage)
  const gstAmt = afterDiscount * (gst / 100);

  // Grand total
  const grandTotal = Math.round(afterDiscount + gstAmt);

  // setGrandTotal(Math.round(afterDiscount + gstAmt));


  // console.log({
  //   subtotal,
  //   discount,
  //   transport,
  //   manpower,
  //   // roundOff,
  //   // gst,
  //   discountAmt,
  //   afterDiscount,
  //   afterCharges,
  //   // gstAmt,
  //   // grandTotal
  // });

  const handleEdit = (idx, qty) => {
    setEditIdx(idx);
    setEditQty(qty);
  };

  // // Save the new qty (with API call)
  // const handleEditSave = async (item) => {
  //   if (editQty < 1 || editQty > item.available) {
  //     toast.error("Quantity must be between 1 and available stock!");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     await axios.put(
  //       `${ApiURL}/Enquiry/update-product-data/${quotation.enquiryId}`,
  //       { productId: item.productId, quantity: editQty, price: item.pricePerUnit, productName:item.productName }
  //     );
  //     await handleEditSaveInQuotaion()
  //     toast.success("Quantity updated!");
  //     setEditIdx(null);
  //     setEditQty(1);
  //     // fetchEnquiry();
  //   } catch (err) {
  //     console.log("err: ", err.response.data.error)
  //     toast.error("Failed to update quantity: ", err);
  //   }
  //   setLoading(false);
  // };

  // // Delete a product (with API call)
  // const handleDelete = async (item) => {
  //   if (!window.confirm("Delete this product?")) return;
  //   setLoading(true);
  //   try {
  //     await axios.delete(
  //       `${ApiURL}/Enquiry/delete-product-data/${quotation.enquiryId}`,
  //       { data: { productId: item.productId } }
  //     );
  //     await handleDeleteInQuotaion
  //     toast.success("Product deleted!");
  //     // fetchEnquiry();
  //   } catch (err) {
  //     toast.error("Failed to delete product");
  //   }
  //   setLoading(false);
  // };

  // Save the new qty (with API call)
  const handleEditSave = async (item) => {
    if (editQty < 1 || editQty > item.available) {
      toast.error("Quantity must be between 1 and less than available stock!");
      return;
    }
    // Update the quantity in the correct slot/product in local state
    const updatedSlots = quotation.slots.map((slot) => ({
      ...slot,
      Products: (slot.Products || []).map((prod) =>
        prod.productId === item.productId
          ? {
            ...prod,
            qty: editQty,
            quantity: editQty,
            total: (editQty * (prod.price || item.pricePerUnit)),
          }
          : prod
      ),
    }));

    setQuotation({ ...quotation, slots: updatedSlots });
    setEditIdx(null);
    setEditQty(1);
  };

  // Delete a product (with API call)
  const handleDelete = async (item) => {
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);

  };

  const handleCancelQuotation = async () => {

  }

  return (
    <Container
      className="my-5"
      style={{ maxWidth: "900px", fontFamily: "'Roboto', sans-serif" }}
    >
      {/* Header with Logo and Title */}
      <div className="d-flex align-items-center mb-4">
        <img
          src={logo}
          alt="Company Logo"
          style={{ height: "50px", marginRight: "20px" }}
        />
        <div>
          <h2 className="mb-0" style={{ color: "#2c3e50", fontWeight: "600" }}>
            Quotation
          </h2>
          <p className="text-muted mb-0">NNC Event Rentals</p>
        </div>
        <Button
          variant="primary"
          className="ms-auto"
          style={{
            background: "linear-gradient(45deg, #3498db, #2980b9)",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontWeight: "500",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Download as PDF
        </Button>
      </div>

      {/* Company and Event Details */}
      <Card className="mb-4 shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
        <Card.Body className="p-4">
          <Table borderless size="sm">
            <tbody>
              <tr>
                <td style={{ width: "25%", fontWeight: "500", color: "#34495e" }}>
                  Company Name
                </td>
                <td style={{ width: "25%" }}>
                  {(quotation.clientName || "").toUpperCase()}
                </td>
                <td style={{ width: "25%", fontWeight: "500", color: "#34495e" }}>
                  Contact Number
                </td>
                <td style={{ width: "25%" }}>{quotation.clientNo || ""}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "500", color: "#34495e" }}>
                  Executive Name
                </td>
                <td>{quotation.executivename || ""}</td>
                <td style={{ fontWeight: "500", color: "#34495e" }}>Venue</td>
                <td>{quotation.placeaddress || ""}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "500", color: "#34495e" }}>
                  Delivery Date
                </td>
                <td>{quotation.quoteDate || ""}</td>
                <td style={{ fontWeight: "500", color: "#34495e" }}>
                  End Date
                </td>
                <td>{quotation.endDate || ""}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "500", color: "#34495e" }}>
                  Address
                </td>
                <td>{quotation.address || ""}</td>
                <td style={{ fontWeight: "500", color: "#34495e" }}>
                  Status
                </td>
                <td>{quotation.status || ""}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Items Table */}
      <Card className="mb-4 shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
        <Card.Body className="p-4">
          <Table
            bordered
            size="sm"
            style={{ borderColor: "#e0e0e0" }}
            className="mb-0"
          >
            <thead
              style={{
                background: "linear-gradient(45deg, #34495e, #2c3e50)",
                color: "#fff",
              }}
            >
              <tr>
                <th>Slot Date</th>
                <th>Product</th>
                <th>Image</th>
                <th>Available</th>
                <th>Qty</th>
                <th>Days</th>
                <th>Price/Qty</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ padding: "12px", verticalAlign: "middle" }}>
                    {item.slotDate.map((d, i) => (
                      <div key={i}>{d}</div>
                    ))}
                  </td>
                  <td style={{ padding: "12px", verticalAlign: "middle" }}>
                    {item.productName}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      verticalAlign: "middle",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={
                        item.image
                          ? `http://api.rentangadi.in/product/${item.image}`
                          : "https://cdn-icons-png.flaticon.com/512/1532/1532801.png"
                      }
                      alt="element"
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "contain",
                        borderRadius: "4px",
                      }}
                    />
                  </td>
                  <td style={{ padding: "12px", verticalAlign: "middle" }}>
                    {item.available}
                  </td>
                  <td style={{ padding: "12px", verticalAlign: "middle" }}>
                    {editIdx === idx ? (
                      <Form.Control
                        type="number"
                        min={1}
                        max={item.available}
                        value={editQty}
                        onChange={(e) => {
                          let val = e.target.value.replace(/^0+/, "");
                          setEditQty(
                            val === ""
                              ? ""
                              : Math.max(
                                1,
                                Math.min(Number(val), item.available)
                              )
                          );
                        }}
                        style={{ width: 70, padding: "2px 6px", fontSize: 13 }}
                        autoFocus
                        disabled={loading}
                      />
                    ) : (
                      item.units
                    )}
                  </td>
                  {/* {console.log("item: ", item)} */}
                  <td style={{ padding: "12px", verticalAlign: "middle" }}>
                    {item.days}
                  </td>
                  <td style={{ padding: "12px", verticalAlign: "middle" }}>
                    ₹{item.pricePerUnit?.toLocaleString()}
                  </td>
                  <td style={{ padding: "12px", verticalAlign: "middle" }}>
                    ₹
                    {item.amount?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td style={{ padding: "12px", verticalAlign: "middle" }}>
                    {editIdx === idx ? (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          style={{ padding: "2px 6px", marginRight: 4 }}
                          onClick={() => handleEditSave(item)}
                          disabled={loading}
                        >
                          <FaCheck />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          style={{ padding: "2px 6px" }}
                          onClick={() => setEditIdx(null)}
                          disabled={loading}
                        >
                          <FaTimes />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="link"
                          size="sm"
                          style={{ color: "#157347", padding: 0 }}
                          onClick={() => handleEdit(idx, item.units)}
                          disabled={loading}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          style={{ color: "#d00", padding: 0, marginLeft: 8 }}
                          onClick={() => handleDelete(item)}
                          disabled={loading}
                        >
                          <FaTrashAlt />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Cost Summary */}
      <Card className="mb-4 shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
        <Card.Body className="p-4">
          <h5 style={{ fontWeight: "600", color: "#2c3e50", marginBottom: "20px" }}>
            Cost Summary
          </h5>
          <div className="d-flex justify-content-between mb-2">
            <span>Discount(%):</span>
            <span>{(quotation.discount || 0).toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Transportation:</span>
            <span>₹{(quotation.transportcharge || 0).toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Manpower Charge:</span>
            <span>₹{(quotation.labourecharge || 0).toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span style={{ fontWeight: "600" }}>Subtotal:</span>
            <span style={{ fontWeight: "600" }}>
              ₹
              {/* {items
                .reduce((sum, item) => sum + (item.amount || 0), 0)
                .toLocaleString(undefined, { minimumFractionDigits: 2 })} */}
              {items
                .reduce((sum, item) => sum + (item.amount || 0), 0)
                .toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Round Off:</span>
            <span>₹{(quotation.adjustments || quotation.roundOff || 0).toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>GST(%):</span>
            <span>{(quotation.GST || 0).toFixed(2)}</span>
          </div>
          <hr style={{ borderColor: "#e0e0e0" }} />
          <div
            className="d-flex justify-content-between"
            style={{ fontSize: "18px", fontWeight: "700", color: "#34495e" }}
          >
            <span>Grand Total:</span>
            {/* <span>
              ₹
              {(quotation.GrandTotal || quotation.grandTotal || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span> */}
            <span>
              ₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </Card.Body>
      </Card>

      {/* Notes */}
      {quotation.termsandCondition && quotation.termsandCondition.length > 0 && (
        <Card className="mb-4 shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
          <Card.Body className="p-4">
            <h5 style={{ fontWeight: "600", color: "#2c3e50", marginBottom: "15px" }}>
              Terms and Notes
            </h5>
            <ul style={{ paddingLeft: "20px", color: "#333", lineHeight: "1.6" }}>
              {quotation.termsandCondition.map((note, idx) => (
                <li key={idx} style={{ marginBottom: "10px" }}>
                  {note}
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="mb-4 shadow-sm" style={{ border: "none", borderRadius: "12px" }}>
        <Card.Body className="p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <Button
            variant="primary"
            style={{
              background: "linear-gradient(45deg, #2980b9, #3498db)",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: "500",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            onClick={handleShowGenerateModal}
          >
            Generate Order
          </Button>
          <Button
            variant="info"
            style={{
              background: "linear-gradient(45deg, #27ae60, #2ecc71)",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: "500",
              transition: "transform 0.2s",
              color: "white",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            onClick={handleShowAdd}
          >
            Add Product
          </Button>
          <Button
            variant="danger"
            style={{
              background: "linear-gradient(45deg, #c0392b, #e74c3c)",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: "500",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            // onClick={() => alert("Cancel Order clicked")}
            onClick={() => handleCancelQuotation()}
          >
            Cancel Quotation
          </Button>
        </Card.Body>
      </Card>
      {/* Add Payment Modal */}
      <Modal show={showGenerateModal} onHide={handleCloseGenerateModal} centered>
        <Modal.Header style={{ borderBottom: "none", padding: "20px 20px 0" }}>
          <Modal.Title style={{ fontWeight: "600", color: "#2c3e50" }}>
            Payment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px" }}>
          <Form>
            {/* Payment Status */}
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "500", color: "#34495e" }}>
                Payment
              </Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Offline"
                  type="checkbox"
                  checked={paymentData.status === "Offline"}
                  onChange={() => handleCheckboxChange("Offline")}
                  style={{ marginRight: "20px" }}
                />
                <Form.Check
                  inline
                  label="Online"
                  type="checkbox"
                  checked={paymentData.status === "Online"}
                  onChange={() => handleCheckboxChange("Online")}
                />
              </div>
            </Form.Group>
            {/* Amount */}
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "500", color: "#34495e" }}>
                Amount
              </Form.Label>
              <div className="d-flex align-items-center">
                <span
                  style={{
                    marginRight: "10px",
                    fontSize: "1.2rem",
                    color: "#34495e",
                  }}
                >
                  ₹
                </span>
                <Form.Control
                  type="number"
                  name="amount"
                  value={paymentData.amount}
                  max={quotation?.GrandTotal}
                  onChange={handleInputChange}
                  placeholder="0"
                  style={{ borderRadius: "6px", borderColor: "#e0e0e0" }}
                />
              </div>
            </Form.Group>
            {/* Payment Mode */}{paymentData.status !== 'Offline' && (
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "500", color: "#34495e" }}>
                  Payment Mode
                </Form.Label>
                <Form.Select
                  name="mode"
                  value={paymentData.mode}
                  onChange={handleInputChange}
                  style={{ borderRadius: "6px", borderColor: "#e0e0e0" }}
                >
                  <option value="">Select Payment Mode</option>
                  <option value="Googlepay">Googlepay</option>
                  <option value="Phonepay">Phonepay</option>
                  <option value="Paytm">Paytm</option>
                  <option value="UPI">UPI</option>
                </Form.Select>
              </Form.Group>
            )}
            {/* Comments */}
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "500", color: "#34495e" }}>
                Comments
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="comments"
                value={paymentData.comments}
                onChange={handleInputChange}
                placeholder="Add any comments or remarks"
                style={{
                  borderRadius: "6px",
                  borderColor: "#e0e0e0",
                  resize: "none",
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none", padding: "0 20px 20px" }}>
          <Button
            style={{
              background: "linear-gradient(45deg, #27ae60, #2ecc71)",
              border: "none",
              borderRadius: "8px",
              padding: "6px 10px",
              fontWeight: "500",
              transition: "transform 0.2s",
              width: "100px",
            }}
            className="btn-sm"
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            // onClick={handleAddPayment}
            onClick={handleUpdateQuotation}

          >
            Add
          </Button>
          <Button
            style={{
              background: "linear-gradient(45deg, #2980b9, #3498db)",
              border: "none",
              borderRadius: "8px",
              padding: "6px 20px",
              fontWeight: "500",
              transition: "transform 0.2s",
            }}
            className="btn-sm"
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            onClick={handleGenerateOrder}
          >
            Skip
          </Button>
          <Button
            style={{
              background: "linear-gradient(45deg,rgb(185, 41, 72), #3498db)",
              border: "none",
              borderRadius: "8px",
              padding: "6px 20px",
              fontWeight: "500",
              transition: "transform 0.2s",
            }}
            className="btn-sm"
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            onClick={handleCloseGenerateModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* add product  */}
      <Modal show={showAdd} onHide={handleCloseAdd} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="addProductSelect">
              <Form.Label>Product Name</Form.Label>
              <Select
                options={availableToAdd.map((p) => ({
                  value: p._id,
                  label: p.ProductName,
                }))}
                value={
                  addProductId
                    ? availableToAdd
                      .map((p) => ({ value: p._id, label: p.ProductName }))
                      .find((opt) => String(opt.value) === String(addProductId))
                    : null
                }
                onChange={handleProductSelect}
                isClearable
                placeholder="Search product..."
              />
            </Form.Group>
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3" controlId="addProductStock">
                  <Form.Label>Available Stock</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      selectedAddProduct ? selectedAddProduct.availableStock : 0
                    }
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3" controlId="addProductQty">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={selectedAddProduct?.availableStock || 1}
                    value={addQty}
                    disabled={!addProductId}
                    onChange={(e) => {
                      let val = e.target.value.replace(/^0+/, "");
                      let qty = val === "" ? "" : Math.max(1, Number(val));
                      if (
                        selectedAddProduct &&
                        qty > selectedAddProduct.availableStock
                      ) {
                        qty = selectedAddProduct.availableStock;
                      }
                      setAddQty(qty);
                    }}
                  />
                  {selectedAddProduct && addQty > selectedAddProduct.availableStock && (
                    <div style={{ color: "red", fontSize: 12 }}>
                      Cannot exceed available stock ({selectedAddProduct.availableStock})
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3" controlId="addProductPrice">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="text"
                    value={`₹${selectedAddProduct ? selectedAddProduct.ProductPrice : 0}`}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3" controlId="addProductTotal">
                  <Form.Label>Total Price</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      selectedAddProduct
                        ? `₹${(addQty ? addQty : 1) * selectedAddProduct.ProductPrice}`
                        : "₹0"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            size="sm"
            disabled={
              !addProductId ||
              !addQty ||
              addQty < 1 ||
              (selectedAddProduct && addQty > selectedAddProduct.availableStock)
            }
            onClick={handleAddProduct}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default QuotationDetails;