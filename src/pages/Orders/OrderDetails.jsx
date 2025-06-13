// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   Table,
//   Button,
//   Row,
//   Col,
//   Modal,
//   Form,
//   Spinner,
//   Container,
// } from "react-bootstrap";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import Select from "react-select";
// import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
// import { ApiURL } from "../../api";
// import { toast } from "react-hot-toast";

// const labelStyle = {
//   color: "#666",
//   fontWeight: 500,
//   fontSize: 13,
//   minWidth: 110,
// };
// const valueStyle = { color: "#222", fontSize: 13, fontWeight: 400 };

// const OrderDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // States for order details
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [products, setProducts] = useState([]);
//   const [showRefModal, setShowRefModal] = useState(false);

//   // Add Product Modal states
//   const [showAdd, setShowAdd] = useState(false);
//   const [allProducts, setAllProducts] = useState([]);
//   const [addProductId, setAddProductId] = useState("");
//   const [addQty, setAddQty] = useState(1);
//   const [selectedAddProduct, setSelectedAddProduct] = useState(null);

//   // Edit product states
//   const [editIdx, setEditIdx] = useState(null);
//   const [editQty, setEditQty] = useState(1);

//   // Refurbishment modal states
//   const [refProduct, setRefProduct] = useState("");
//   const [refQty, setRefQty] = useState("");
//   const [refPrice, setRefPrice] = useState("");
//   const [refDamage, setRefDamage] = useState("");
//   const [addedRefProducts, setAddedRefProducts] = useState([]);
//   const [shippingAddress, setShippingAddress] = useState("");
//   const [floorManager, setFloorManager] = useState("");

//   // Fetch order details by id
//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${ApiURL}/order/getOrder/${id}`
//         );
//         if (response.data.order) {
//           setOrder(response.data.order);

//           // Safely extract products from slot-level or order-level
//           let mergedProducts = [];

//           if (
//             Array.isArray(response.data.order.slots) &&
//             response.data.order.slots.length > 0
//           ) {
//             // Combine products from all slots
//             response.data.order.slots.forEach((slot) => {
//               if (Array.isArray(slot.products)) {
//                 slot.products.forEach((p) => {
//                   mergedProducts.push({
//                     ...p,
//                     unitPrice: p.total / (p.quantity),
//                     availableStock: p.availableStock,
//                   });
//                 });
//               }
//             });
//           }

//           // If slot-based products are empty, fall back to order.products (if they have names)
//           if (
//             mergedProducts.length === 0 &&
//             Array.isArray(response.data.order.products) &&
//             response.data.order.products[0]?.productName
//           ) {
//             mergedProducts = response.data.order.products.map((p) => ({
//               ...p,
//               unitPrice: p.total / (p.quantity),
//               availableStock: p.availableStock ,
//             }));
//           }

//           setProducts(mergedProducts);
//         }
//       } catch (error) {
//         console.error("Error fetching order details", error);
//       }
//       setLoading(false);
//     };
//     fetchOrderDetails();
//   }, [id]);

//   // Fetch all products for add modal
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
//     fetchAllProducts();
//   }, []);
//   // Calculate grand total based on products
//   const grandTotal = products.reduce((sum, p) => sum + Number(p.total || 0), 0);

//   // Add Product Modal logic
//   const addedProductIds = products.map((p) => String(p.productId || p._id));
//   const availableToAdd = allProducts.filter(
//     (p) => !addedProductIds.includes(String(p._id))
//   );

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

//   const handleProductSelect = async (selected) => {
//     if (selected) {
//       const productId = selected.value;
//       setAddProductId(productId);
//       setAddQty(1);

//       const productObj = allProducts.find(
//         (p) => String(p._id) === String(productId)
//       );

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

//         console.log("inventory/product/filter res.data: ", res.data);

//         if (res.data?.availableStock) {
//           console.log("res.data?.avaiableStock");
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

//   const handleAddProduct = () => {
//     if (!selectedAddProduct || !addQty) return;

//     // Prepare new product object
//     const newProduct = {
//       productId: selectedAddProduct._id,
//       productName: selectedAddProduct.ProductName,
//       quantity: addQty,
//       unitPrice: Number(selectedAddProduct.ProductPrice),
//       total: addQty * Number(selectedAddProduct.ProductPrice),
//       ProductIcon: selectedAddProduct.ProductIcon,
//       availableStock: selectedAddProduct.availableStock,
//     };

//     setProducts((prev) => [...prev, newProduct]);
//     setShowAdd(false);
//   };

//   // Edit product logic
//   const handleEdit = (idx, qty) => {
//     setEditIdx(idx);
//     setEditQty(qty);
//   };

//   const handleEditSave = (idx) => {
//     if (editQty < 1 || editQty > (products[idx].availableStock || 1)) {
//       toast.error("Quantity must be between 1 and available stock!");
//       return;
//     }
//     setProducts((prev) =>
//       prev.map((prod, i) =>
//         i === idx
//           ? {
//               ...prod,
//               quantity: editQty,
//               total: editQty * prod.unitPrice,
//             }
//           : prod
//       )
//     );
//     setEditIdx(null);
//     setEditQty(1);
//   };

//   // Delete product logic
//   const handleDelete = (idx) => {
//     if (!window.confirm("Delete this product?")) return;
//     setProducts((prev) => prev.filter((_, i) => i !== idx));
//   };

//   // Refurbishment modal handlers
//   const handleAddRefProduct = () => {
//     if (!refProduct || !refQty || !refPrice) return;
//     setAddedRefProducts((prev) => [
//       ...prev,
//       {
//         productName: refProduct,
//         qty: Number(refQty),
//         price: refPrice,
//         damage: refDamage,
//       },
//     ]);
//     setRefProduct("");
//     setRefQty("");
//     setRefPrice("");
//     setRefDamage("");
//   };

//   const handleCloseRefModal = () => {
//     setShowRefModal(false);
//     setRefProduct("");
//     setRefQty("");
//     setRefPrice("");
//     setRefDamage("");
//     setAddedRefProducts([]);
//     setShippingAddress("");
//     setFloorManager("");
//   };

//   if (loading) {
//     return (
//       <Container className="my-5 text-center">
//         <Spinner animation="border" />
//       </Container>
//     );
//   }

//   if (!order) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-3" style={{ background: "#f6f8fa", minHeight: "100vh" }}>
//       <Card className="shadow-sm mb-4" style={{ borderRadius: 12 }}>
//         <Card.Body>
//           <h6 className="mb-3" style={{ fontWeight: 700, fontSize: 17 }}>
//             Order Details
//           </h6>

//           <Row className="mb-2">
//             <Col xs={12} md={6}>
//               <div className="mb-1" style={{ display: "flex", gap: "10px" }}>
//                 <span style={labelStyle}>Client Id:</span>
//                 <span style={valueStyle}>{order.ClientId}</span>
//               </div>
//               <div className="mb-1" style={{ display: "flex", gap: "10px" }}>
//                 <span style={labelStyle}>Company Name: </span>
//                 <span style={valueStyle}>{order.clientName}</span>
//               </div>
//               <div className="mb-1" style={{ display: "flex", gap: "10px" }}>
//                 <span style={labelStyle}>Phone No: </span>
//                 <span style={valueStyle}>{order.clientNo}</span>
//               </div>
//               <div className="mb-1" style={{ display: "flex", gap: "10px" }}>
//                 <span style={labelStyle}>Executive Name: </span>
//                 <span style={valueStyle}>{order.executivename}</span>
//               </div>
//               <div className="mb-1" style={{ display: "flex", gap: "10px" }}>
//                 <span style={labelStyle}>Address: </span>
//                 <span style={valueStyle}>{order.placeaddress}</span>
//               </div>
//             </Col>
//             <Col xs={12} md={6}>
//               <div className="mb-1" style={{ display: "flex", gap: "10px" }}>
//                 <span style={labelStyle}>Order Status: </span>
//                 <span
//                   style={{ ...valueStyle, color: "#1dbf73", fontWeight: 600 }}
//                 >
//                   {order.orderStatus}
//                 </span>
//               </div>
//               <div className="mb-1" style={{ display: "flex", gap: "10px" }}>
//                 <span style={labelStyle}>Grand Total: </span>
//                 <span style={valueStyle}>₹{grandTotal}</span>
//               </div>
//             </Col>
//           </Row>
//           <hr className="my-3" />
//           <div className="d-flex justify-content-between align-items-center mb-2">
//             <span style={{ fontSize: 14, fontWeight: 600 }}>Products</span>
//             <div>
//               <Button
//                 variant="outline-success"
//                 size="sm"
//                 style={{ fontSize: 12, padding: "2px 14px", marginRight: 8 }}
//                 onClick={handleShowAdd}
//               >
//                 Add Product
//               </Button>
//               <Button
//                 variant="outline-success"
//                 size="sm"
//                 style={{ fontSize: 12, padding: "2px 14px" }}
//                 onClick={() => setShowRefModal(true)}
//               >
//                 Add Refurbishment
//               </Button>
//             </div>
//           </div>
//           <div className="table-responsive mb-3">
//             <Table
//               bordered
//               size="sm"
//               style={{ background: "#fff", fontSize: 13, borderRadius: 8 }}
//             >
//               <thead>
//                 <tr style={{ background: "#f3f6fa" }}>
//                   <th style={{ width: "35%" }}>Slot</th>
//                   <th>Product Name</th>
//                   <th>Available Stock</th>
//                   <th>Selected Qty</th>
//                   <th>Total</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((prod, idx) => {
//                   const slotDate =
//                     order.slots && order.slots.length > 0
//                       ? `${order.slots[0].quoteDate} to ${order.slots[0].endDate}`
//                       : "No Slot";
//                   return (
//                     <tr key={idx}>
//                       <td style={{ fontWeight: 500, color: "#444" }}>
//                         {slotDate}
//                       </td>
//                       <td>{prod.productName}</td>
//                       <td>
//                         <span style={{ color: "#1a73e8", fontWeight: 500 }}>
//                           {prod.availableStock}
//                         </span>
//                       </td>
//                       <td>
//                         {editIdx === idx ? (
//                           <Form.Control
//                             type="number"
//                             min={1}
//                             max={prod.availableStock}
//                             value={editQty}
//                             onChange={(e) => {
//                               let val = e.target.value.replace(/^0+/, "");
//                               setEditQty(
//                                 val === ""
//                                   ? ""
//                                   : Math.max(
//                                       1,
//                                       Math.min(Number(val), prod.availableStock)
//                                     )
//                               );
//                             }}
//                             style={{
//                               width: 70,
//                               padding: "2px 6px",
//                               fontSize: 13,
//                             }}
//                             autoFocus
//                           />
//                         ) : (
//                           prod.quantity
//                         )}
//                       </td>
//                       <td>₹{prod.total ? prod.total.toFixed(2) : 0}</td>
//                       <td>
//                         {editIdx === idx ? (
//                           <>
//                             <Button
//                               variant="success"
//                               size="sm"
//                               style={{ padding: "2px 6px", marginRight: 4 }}
//                               onClick={() => handleEditSave(idx)}
//                             >
//                               <FaCheck />
//                             </Button>
//                             <Button
//                               variant="secondary"
//                               size="sm"
//                               style={{ padding: "2px 6px" }}
//                               onClick={() => setEditIdx(null)}
//                             >
//                               <FaTimes />
//                             </Button>
//                           </>
//                         ) : (
//                           <>
//                             <Button
//                               variant="link"
//                               size="sm"
//                               style={{ color: "#157347", padding: 0 }}
//                               onClick={() => handleEdit(idx, prod.quantity)}
//                             >
//                               <FaEdit />
//                             </Button>
//                             <Button
//                               variant="link"
//                               size="sm"
//                               style={{
//                                 color: "#d00",
//                                 padding: 0,
//                                 marginLeft: 8,
//                               }}
//                               onClick={() => handleDelete(idx)}
//                             >
//                               <FaTrashAlt />
//                             </Button>
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>
//           </div>
//           <div className="mb-2" style={{ fontWeight: 600, fontSize: 14 }}>
//             Refurbishment Details
//           </div>
//           <div className="table-responsive">
//             <Table
//               bordered
//               size="sm"
//               style={{ background: "#fff", fontSize: 13, borderRadius: 8 }}
//             >
//               <thead>
//                 <tr style={{ background: "#f3f6fa" }}>
//                   <th>Product Name</th>
//                   <th>Quantity</th>
//                   <th>Price</th>
//                   <th>Damage Description</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {addedRefProducts.map((item, idx) => (
//                   <tr key={idx}>
//                     <td>{item.productName}</td>
//                     <td>{item.qty}</td>
//                     <td>₹{item.price}</td>
//                     <td>{item.damage}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//           <div className="d-flex flex-wrap gap-2 mt-3">
//             <Button
//               variant="primary"
//               size="sm"
//               style={{ fontSize: 13, fontWeight: 600 }}
//               onClick={() => navigate(`/invoice/12`)}
//             >
//               Generate Invoice
//             </Button>
//             <Button
//               variant="info"
//               size="sm"
//               style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}
//             >
//               Refurbishment Invoice
//             </Button>
//             <Button
//               variant="danger"
//               size="sm"
//               style={{ fontSize: 13, fontWeight: 600 }}
//             >
//               Cancel Order
//             </Button>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Add Product Modal */}
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
//                         .map((p) => ({ value: p._id, label: p.ProductName }))
//                         .find(
//                           (opt) => String(opt.value) === String(addProductId)
//                         )
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
//                   {selectedAddProduct &&
//                     addQty > selectedAddProduct.availableStock && (
//                       <div style={{ color: "red", fontSize: 12 }}>
//                         Cannot exceed available stock (
//                         {selectedAddProduct.availableStock})
//                       </div>
//                     )}
//                 </Form.Group>
//               </Col>
//               <Col xs={6}>
//                 <Form.Group className="mb-3" controlId="addProductPrice">
//                   <Form.Label>Price</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={`₹${
//                       selectedAddProduct ? selectedAddProduct.ProductPrice : 0
//                     }`}
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
//                         ? `₹${
//                             (addQty ? addQty : 1) *
//                             selectedAddProduct.ProductPrice
//                           }`
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

//       {/* Refurbishment Modal */}
//       <Modal show={showRefModal} onHide={handleCloseRefModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title style={{ fontSize: 18, fontWeight: 600 }}>
//             Add Refurbishment
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-2">
//               <Form.Label style={{ fontSize: 14, fontWeight: 500 }}>
//                 Select Product Name <span style={{ color: "red" }}>*</span>
//               </Form.Label>
//               <Form.Select
//                 value={refProduct}
//                 onChange={(e) => {
//                   setRefProduct(e.target.value);
//                   setRefQty("");
//                   setRefPrice("");
//                   setRefDamage("");
//                 }}
//               >
//                 <option value="">Select products...</option>
//                 {products.map((prod, idx) => (
//                   <option key={idx} value={prod.productName}>
//                     {prod.productName}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//             {refProduct && (
//               <div
//                 className="mb-3"
//                 style={{
//                   background: "#f8f9fa",
//                   borderRadius: 8,
//                   padding: 10,
//                   gap: 10,
//                 }}
//               >
//                 <div style={{ minWidth: 120, fontWeight: 500 }}>
//                   {refProduct}
//                 </div>
//                 <div className="d-flex gap-2 my-2">
//                   <Form.Control
//                     type="number"
//                     min={1}
//                     max={
//                       products.find((p) => p.productName === refProduct)
//                         ?.availableStock || 1
//                     }
//                     placeholder="Quantity"
//                     value={refQty}
//                     style={{ width: 80, fontSize: 13 }}
//                     onChange={(e) => {
//                       let maxQty =
//                         products.find((p) => p.productName === refProduct)
//                           ?.availableStock || 1;
//                       let val = e.target.value.replace(/^0+/, "");
//                       if (val === "") setRefQty("");
//                       else
//                         setRefQty(Math.max(1, Math.min(Number(val), maxQty)));
//                     }}
//                   />
//                   <Form.Control
//                     type="number"
//                     min={1}
//                     placeholder="Price"
//                     value={refPrice}
//                     style={{ width: 80, fontSize: 13 }}
//                     onChange={(e) =>
//                       setRefPrice(e.target.value.replace(/^0+/, ""))
//                     }
//                   />
//                   <Form.Control
//                     type="text"
//                     placeholder="Damage"
//                     value={refDamage}
//                     style={{ width: 100, fontSize: 13 }}
//                     onChange={(e) => setRefDamage(e.target.value)}
//                   />
//                   <Button
//                     variant="success"
//                     size="sm"
//                     style={{ fontWeight: 600, minWidth: 60 }}
//                     onClick={handleAddRefProduct}
//                     disabled={
//                       !refProduct ||
//                       !refQty ||
//                       !refPrice ||
//                       Number(refQty) < 1 ||
//                       Number(refPrice) < 1
//                     }
//                   >
//                     Add
//                   </Button>
//                 </div>
//               </div>
//             )}
//             <Form.Group className="mb-2">
//               <Form.Label style={{ fontSize: 14, fontWeight: 500 }}>
//                 Shipping Address <span style={{ color: "red" }}>*</span>
//               </Form.Label>
//               <Form.Control
//                 type="text"
//                 value={shippingAddress}
//                 onChange={(e) => setShippingAddress(e.target.value)}
//                 placeholder="Enter shipping address"
//               />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label style={{ fontSize: 14, fontWeight: 500 }}>
//                 Floor Manager
//               </Form.Label>
//               <Form.Control
//                 type="text"
//                 value={floorManager}
//                 onChange={(e) => setFloorManager(e.target.value)}
//                 placeholder="Enter floor manager"
//               />
//             </Form.Group>
//             <div
//               style={{ fontWeight: 600, fontSize: 15, margin: "12px 0 6px" }}
//             >
//               Added Products
//             </div>
//             <div className="table-responsive">
//               <Table
//                 bordered
//                 size="sm"
//                 style={{ background: "#fff", fontSize: 13 }}
//               >
//                 <thead>
//                   <tr style={{ background: "#f3f6fa" }}>
//                     <th>Product</th>
//                     <th>Qty</th>
//                     <th>Price</th>
//                     <th>Damage</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {addedRefProducts.map((item, idx) => (
//                     <tr key={idx}>
//                       <td>{item.productName}</td>
//                       <td>{item.qty}</td>
//                       <td>₹{item.price}</td>
//                       <td>{item.damage}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseRefModal}>
//             Close
//           </Button>
//           <Button
//             variant="primary"
//             disabled={!shippingAddress || addedRefProducts.length === 0}
//             onClick={() => {
//               // Submit logic here
//               handleCloseRefModal();
//             }}
//           >
//             Submit
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default OrderDetails;


import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Spinner,
  Container,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { ApiURL } from "../../api";
import { toast } from "react-hot-toast";

const labelStyle = {
  color: "#666",
  fontWeight: 500,
  fontSize: 13,
  minWidth: 110,
};
const valueStyle = { color: "#222", fontSize: 13, fontWeight: 400 };

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // States for order details
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [showRefModal, setShowRefModal] = useState(false);

  // Add Product Modal states
  const [showAdd, setShowAdd] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [addProductId, setAddProductId] = useState("");
  const [addQty, setAddQty] = useState(1);
  const [selectedAddProduct, setSelectedAddProduct] = useState(null);

  // Edit product states
  const [editIdx, setEditIdx] = useState(null);
  const [editQty, setEditQty] = useState(1);

  // Refurbishment modal states
  const [refProduct, setRefProduct] = useState("");
  const [refQty, setRefQty] = useState("");
  const [refPrice, setRefPrice] = useState("");
  const [refDamage, setRefDamage] = useState("");
  const [addedRefProducts, setAddedRefProducts] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [floorManager, setFloorManager] = useState("");


  useEffect(() => {
    console.log("useeffect");
    fetchOrderDetails();
    fetchAllProducts();
  }, [products]); // This runs once on component mount

  useEffect(() => {
    if (order) {
      fetchFilteredInventoryForOrder();
    }
  }, [order]); // Trigger this when order details are set

  // Fetching filtered inventory for the order details
  const fetchFilteredInventoryForOrder = async () => {
    console.log("order before fetch call: ", order);
    console.log("products: ", products)
    try {
      const response = await axios.get(`${ApiURL}/inventory/filter`, {
        params: {
          startDate: order?.slots[0].quoteDate,  // Assuming `startDate` exists in the order
          endDate: order?.slots[0].endDate,      // Assuming `endDate` exists in the order
          products: order?.slots[0].products.map(p => p.productId).join(","),
        },
      });

      console.log(`${ApiURL}/inventory/filter: `, response.data);
      let filtered = response.data.stock || [];
      console.log("filtered: ", filtered)

      if (order?.slots?.length && filtered?.length) {
        // Loop through each slot in the order
        order.slots = order.slots.map((slot) => {
          if (slot?.products?.length) {
            // Loop through each product in the slot's products
            slot.products = slot.products.map((product) => {
              const stock = filtered.find((item) => item.productId === product.productId);

              // If stock is found, inject availableStock into the product, otherwise default to 0
              return {
                ...product,
                availableStock: stock ? stock.availableStock : 0,
              };
            });
          }
          return slot;
        });

        console.log("order slots: ",order.slots[0].products[0 ])

        // You can also update the top-level `products` if you want
        if (order?.products?.length) {
          order.products = order.products.map((product) => {
            const stock = filtered.find((item) => item.productId === product.productId);

            // Update the top-level product with available stock
            return {
              ...product,
              availableStock: stock ? stock.availableStock : 0,
            };
          });
        }

        console.log("Updated order with available stock: ", order);
      }



      // // Directly inject available stock into each product in the order
      // if (order?.products?.length && filtered?.length) {
      //   order.products = order.products.map((product) => {
      //     const stock = filtered.find((item) => item.productId === product.productId);
      //     return {
      //       ...product,
      //       availableStock: stock ? stock.availableStock : 0, // If stock found, add availableStock, else 0
      //     };
      //   });
      //   console.log("order after fetch: ",  order)

      //   // Now you can do anything with the updated order object
      //   console.log("Updated order with available stock: ", order);
      // }

      // // Directly inject available stock into each product in the order
      // // if (filtered?.length) {
      //   const updatedOrder = { ...order };  // Clone the order object

      //   updatedOrder.products = updatedOrder.products.map((product) => {
      //     const stock = filtered.find((item) => item.productId === product.productId);
      //     return {
      //       ...product,
      //       availableStock: stock ? stock.availableStock : 0, // If stock found, add availableStock, else 0
      //     };
      //   });

      //   // Use `setOrder` to update the state with the modified order
      //   setOrder(updatedOrder);

      // console.log("Updated order with available stock: ", updatedOrder);
      // }

    } catch (error) {
      console.error("Error fetching inventory for order:", error);
    }
  };

  // Fetch Order Details
  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(`${ApiURL}/order/getOrder/${id}`);
      if (res.status === 200) {
        setOrder(res.data.order); // <-- Make sure your backend returns the order details
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(`${ApiURL}/product/quoteproducts`);
      if (res.status === 200) {
        setAllProducts(res.data.QuoteProduct || []);
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  // Fetch order details by id
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${ApiURL}/order/getOrder/${id}`);
        console.log("res data: ", response.data);

        if (response.data.order) {
          // First, set the order data
          setOrder(response.data.order);

          let mergedProducts = [];

          // Process order slots to merge products
          if (
            Array.isArray(response.data.order.slots) &&
            response.data.order.slots.length > 0
          ) {
            response.data.order.slots.forEach((slot) => {
              if (Array.isArray(slot.products)) {
                slot.products.forEach((p) => {
                  mergedProducts.push({
                    ...p,
                    unitPrice: p.total / (p.quantity),
                  });
                });
              }
            });
          }

          // If no products in slots, use products directly from the order
          if (
            mergedProducts.length === 0 &&
            Array.isArray(response.data.order.products) &&
            response.data.order.products[0]?.productName
          ) {
            mergedProducts = response.data.order.products.map((p) => ({
              ...p,
              unitPrice: p.total / (p.quantity),
            }));
          }

          console.log("mergedProducts: ",mergedProducts)
          // Fetch available stock for all products and inject it into the mergedProducts array
          const stockMap = await fetchAvailableStockForAllProducts(mergedProducts);

          // Merge the stock data with products
          const mergedWithStock = mergedProducts.map((prod) => ({
            ...prod,
            availableStock: stockMap[prod.productId || prod._id] ?? prod.availableStock ?? 0,
          }));

          // Now, set the products after the order is fully set
          setProducts(mergedWithStock);
        }
      } catch (error) {
        console.error("Error fetching order details", error);
      }
      setLoading(false);
    };

    fetchOrderDetails();
  }, [id]);

  useEffect(() => {
    fetchAllProducts();
  }, []);
  // Calculate grand total based on products
  const grandTotal = products.reduce((sum, p) => sum + Number(p.total || 0), 0);

  // Add Product Modal logic
  const addedProductIds = products.map((p) => String(p.productId || p._id));
  const availableToAdd = allProducts.filter(
    (p) => !addedProductIds.includes(String(p._id))
  );

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

  const handleProductSelect = async (selected) => {
    if (selected) {
      const productId = selected.value;
      setAddProductId(productId);
      setAddQty(1);

      const productObj = allProducts.find(
        (p) => String(p._id) === String(productId)
      );

      try {
        console.log("order quotedate: ", order.slots[0].quoteDate)
        console.log("order enddate: ", order.slots[0].endDate)
        const res = await axios.post(
          `${ApiURL}/inventory/product/filter/${productId}`,
          {},
          {
            params: {
              startDate: order.slots[0].quoteDate,
              endDate: order.slots[0].endDate,
              productId,
            },
          }
        );

        console.log("inventory/product/filter res.data: ", res.data);

        if (res.data?.availableStock) {
          console.log("res.data?.avaiableStock");
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

  const handleAddProduct = () => {
    if (!selectedAddProduct || !addQty) return;

    // Prepare new product object
    const newProduct = {
      productId: selectedAddProduct._id,
      productName: selectedAddProduct.ProductName,
      quantity: addQty,
      unitPrice: Number(selectedAddProduct.ProductPrice),
      total: addQty * Number(selectedAddProduct.ProductPrice),
      ProductIcon: selectedAddProduct.ProductIcon,
      availableStock: selectedAddProduct.availableStock,
    };

    setProducts((prev) => [...prev, newProduct]);
    setShowAdd(false);
  };

  // Edit product logic
  const handleEdit = (idx, qty) => {
    setEditIdx(idx);
    setEditQty(qty);
  };

  const handleEditSave = (idx) => {
    if (editQty < 1 || editQty > (products[idx].availableStock || 1)) {
      toast.error("Quantity must be between 1 and available stock!");
      return;
    }
    setProducts((prev) =>
      prev.map((prod, i) =>
        i === idx
          ? {
            ...prod,
            quantity: editQty,
            total: editQty * prod.unitPrice,
          }
          : prod
      )
    );
    setEditIdx(null);
    setEditQty(1);
  };

  // Delete product logic
  const handleDelete = (idx) => {
    if (!window.confirm("Delete this product?")) return;
    setProducts((prev) => prev.filter((_, i) => i !== idx));
  };

  // Refurbishment modal handlers
  const handleAddRefProduct = () => {
    if (!refProduct || !refQty || !refPrice) return;
    setAddedRefProducts((prev) => [
      ...prev,
      {
        productName: refProduct,
        qty: Number(refQty),
        price: refPrice,
        damage: refDamage,
      },
    ]);
    setRefProduct("");
    setRefQty("");
    setRefPrice("");
    setRefDamage("");
  };

  const handleCloseRefModal = () => {
    setShowRefModal(false);
    setRefProduct("");
    setRefQty("");
    setRefPrice("");
    setRefDamage("");
    setAddedRefProducts([]);
    setShippingAddress("");
    setFloorManager("");
  };

  useEffect(()=>{
    fetchAvailableStockForAllProducts()
  },[products])

  const fetchAvailableStockForAllProducts = async (products) => {
    const productIds = Array.from(
      new Set(products.map((prod) => prod.productId || prod._id))
    );
    if (productIds.length === 0) return {};

    console.log("order: ", order)
    console.log("startDate: ", order?.slots[0].quoteDate)
    console.log("endDate: ", order?.slots[0].endDate)

    try {
      const response = await axios.get(`${ApiURL}/inventory/filter`, {
        params: { products: productIds.join(","), startDate: order?.slots[0].quoteDate, endDate: order?.slots[0].endDate },
      });
      // Assume response.data.stock is [{ productId, availableStock }]
      const stockMap = {};
      (response.data.stock || []).forEach((item) => {
        stockMap[item.productId] = item.availableStock;
      });
      console.log("stockmap: ",stockMap) 
      return stockMap;
    } catch (error) {
      console.error("Error fetching available stock for all products:", error);
      return {};
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!order) {
    return <div>Loading...</div>;
  }

  const handleClickHello = () => {
    console.log("handleClickHello: ", order.slots[0])
  }

  return (
    <div className="p-3" style={{ background: "#f6f8fa", minHeight: "100vh" }}>
      <button onClick={handleClickHello}>heelo</button>
      <Card className="shadow-sm mb-4" style={{ borderRadius: 12 }}>
        <Card.Body>
          <h6 className="mb-3" style={{ fontWeight: 700, fontSize: 17 }}>
            Order Details
          </h6>

          <Row className="mb-2">
            <Col xs={12} md={6}>
              <div className="mb-1" style={{ display: "flex", gap: "10px" }}>
                <span style={labelStyle}>Client Id:</span>
                <span style={valueStyle}>{order.ClientId}</span>
              </div>
              <div className="mb-1" style={{ display: "flex", gap: "10px" }}>
                <span style={labelStyle}>Company Name: </span>
                <span style={valueStyle}>{order.clientName}</span>
              </div>
              <div className="mb-1" style={{ display: "flex", gap: "10px" }}>
                <span style={labelStyle}>Phone No: </span>
                <span style={valueStyle}>{order.clientNo}</span>
              </div>
              <div className="mb-1" style={{ display: "flex", gap: "10px" }}>
                <span style={labelStyle}>Executive Name: </span>
                <span style={valueStyle}>{order.executivename}</span>
              </div>
              <div className="mb-1" style={{ display: "flex", gap: "10px" }}>
                <span style={labelStyle}>Address: </span>
                <span style={valueStyle}>{order.placeaddress}</span>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="mb-1" style={{ display: "flex", gap: "10px" }}>
                <span style={labelStyle}>Order Status: </span>
                <span
                  style={{ ...valueStyle, color: "#1dbf73", fontWeight: 600 }}
                >
                  {order.orderStatus}
                </span>
              </div>
              <div className="mb-1" style={{ display: "flex", gap: "10px" }}>
                <span style={labelStyle}>Grand Total: </span>
                <span style={valueStyle}>₹{grandTotal}</span>
              </div>
            </Col>
          </Row>
          <hr className="my-3" />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span style={{ fontSize: 14, fontWeight: 600 }}>Products</span>
            <div>
              <Button
                variant="outline-success"
                size="sm"
                style={{ fontSize: 12, padding: "2px 14px", marginRight: 8 }}
                onClick={handleShowAdd}
              >
                Add Product
              </Button>
              <Button
                variant="outline-success"
                size="sm"
                style={{ fontSize: 12, padding: "2px 14px" }}
                onClick={() => setShowRefModal(true)}
              >
                Add Refurbishment
              </Button>
            </div>
          </div>
          <div className="table-responsive mb-3">
            <Table
              bordered
              size="sm"
              style={{ background: "#fff", fontSize: 13, borderRadius: 8 }}
            >
              <thead>
                <tr style={{ background: "#f3f6fa" }}>
                  <th style={{ width: "35%" }}>Slot</th>
                  <th>Product Name</th>
                  <th>Available Stock</th>
                  <th>Selected Qty</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod, idx) => {
                  const slotDate =
                    order.slots && order.slots.length > 0
                      ? `${order.slots[0].quoteDate} to ${order.slots[0].endDate}`
                      : "No Slot";
                  return (
                    <tr key={idx}>
                      <td style={{ fontWeight: 500, color: "#444" }}>
                        {slotDate}
                      </td>
                      <td>{prod.productName}</td>
                      <td>
                        <span style={{ color: "#1a73e8", fontWeight: 500 }}>
                          {prod.availableStock}
                        </span>
                      </td>
                      <td>
                        {editIdx === idx ? (
                          <Form.Control
                            type="number"
                            min={1}
                            max={prod.availableStock}
                            value={editQty}
                            onChange={(e) => {
                              let val = e.target.value.replace(/^0+/, "");
                              setEditQty(
                                val === ""
                                  ? ""
                                  : Math.max(
                                    1,
                                    Math.min(Number(val), prod.availableStock)
                                  )
                              );
                            }}
                            style={{
                              width: 70,
                              padding: "2px 6px",
                              fontSize: 13,
                            }}
                            autoFocus
                          />
                        ) : (
                          prod.quantity
                        )}
                      </td>
                      <td>₹{prod.total ? prod.total.toFixed(2) : 0}</td>
                      <td>
                        {editIdx === idx ? (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              style={{ padding: "2px 6px", marginRight: 4 }}
                              onClick={() => handleEditSave(idx)}
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              style={{ padding: "2px 6px" }}
                              onClick={() => setEditIdx(null)}
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
                              onClick={() => handleEdit(idx, prod.quantity)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              style={{
                                color: "#d00",
                                padding: 0,
                                marginLeft: 8,
                              }}
                              onClick={() => handleDelete(idx)}
                            >
                              <FaTrashAlt />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <div className="mb-2" style={{ fontWeight: 600, fontSize: 14 }}>
            Refurbishment Details
          </div>
          <div className="table-responsive">
            <Table
              bordered
              size="sm"
              style={{ background: "#fff", fontSize: 13, borderRadius: 8 }}
            >
              <thead>
                <tr style={{ background: "#f3f6fa" }}>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Damage Description</th>
                </tr>
              </thead>
              <tbody>
                {addedRefProducts.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.productName}</td>
                    <td>{item.qty}</td>
                    <td>₹{item.price}</td>
                    <td>{item.damage}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="d-flex flex-wrap gap-2 mt-3">
            <Button
              variant="primary"
              size="sm"
              style={{ fontSize: 13, fontWeight: 600 }}
              onClick={() => navigate(`/invoice/12`)}
            >
              Generate Invoice
            </Button>
            <Button
              variant="info"
              size="sm"
              style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}
            >
              Refurbishment Invoice
            </Button>
            <Button
              variant="danger"
              size="sm"
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              Cancel Order
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Add Product Modal */}
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
                      .find(
                        (opt) => String(opt.value) === String(addProductId)
                      )
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
                  {selectedAddProduct &&
                    addQty > selectedAddProduct.availableStock && (
                      <div style={{ color: "red", fontSize: 12 }}>
                        Cannot exceed available stock (
                        {selectedAddProduct.availableStock})
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3" controlId="addProductPrice">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="text"
                    value={`₹${selectedAddProduct ? selectedAddProduct.ProductPrice : 0
                      }`}
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
                        ? `₹${(addQty ? addQty : 1) *
                        selectedAddProduct.ProductPrice
                        }`
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

      {/* Refurbishment Modal */}
      <Modal show={showRefModal} onHide={handleCloseRefModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: 18, fontWeight: 600 }}>
            Add Refurbishment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: 14, fontWeight: 500 }}>
                Select Product Name <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Select
                value={refProduct}
                onChange={(e) => {
                  setRefProduct(e.target.value);
                  setRefQty("");
                  setRefPrice("");
                  setRefDamage("");
                }}
              >
                <option value="">Select products...</option>
                {products.map((prod, idx) => (
                  <option key={idx} value={prod.productName}>
                    {prod.productName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {refProduct && (
              <div
                className="mb-3"
                style={{
                  background: "#f8f9fa",
                  borderRadius: 8,
                  padding: 10,
                  gap: 10,
                }}
              >
                <div style={{ minWidth: 120, fontWeight: 500 }}>
                  {refProduct}
                </div>
                <div className="d-flex gap-2 my-2">
                  <Form.Control
                    type="number"
                    min={1}
                    max={
                      products.find((p) => p.productName === refProduct)
                        ?.availableStock || 1
                    }
                    placeholder="Quantity"
                    value={refQty}
                    style={{ width: 80, fontSize: 13 }}
                    onChange={(e) => {
                      let maxQty =
                        products.find((p) => p.productName === refProduct)
                          ?.availableStock || 1;
                      let val = e.target.value.replace(/^0+/, "");
                      if (val === "") setRefQty("");
                      else
                        setRefQty(Math.max(1, Math.min(Number(val), maxQty)));
                    }}
                  />
                  <Form.Control
                    type="number"
                    min={1}
                    placeholder="Price"
                    value={refPrice}
                    style={{ width: 80, fontSize: 13 }}
                    onChange={(e) =>
                      setRefPrice(e.target.value.replace(/^0+/, ""))
                    }
                  />
                  <Form.Control
                    type="text"
                    placeholder="Damage"
                    value={refDamage}
                    style={{ width: 100, fontSize: 13 }}
                    onChange={(e) => setRefDamage(e.target.value)}
                  />
                  <Button
                    variant="success"
                    size="sm"
                    style={{ fontWeight: 600, minWidth: 60 }}
                    onClick={handleAddRefProduct}
                    disabled={
                      !refProduct ||
                      !refQty ||
                      !refPrice ||
                      Number(refQty) < 1 ||
                      Number(refPrice) < 1
                    }
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: 14, fontWeight: 500 }}>
                Shipping Address <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter shipping address"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: 14, fontWeight: 500 }}>
                Floor Manager
              </Form.Label>
              <Form.Control
                type="text"
                value={floorManager}
                onChange={(e) => setFloorManager(e.target.value)}
                placeholder="Enter floor manager"
              />
            </Form.Group>
            <div
              style={{ fontWeight: 600, fontSize: 15, margin: "12px 0 6px" }}
            >
              Added Products
            </div>
            <div className="table-responsive">
              <Table
                bordered
                size="sm"
                style={{ background: "#fff", fontSize: 13 }}
              >
                <thead>
                  <tr style={{ background: "#f3f6fa" }}>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Damage</th>
                  </tr>
                </thead>
                <tbody>
                  {addedRefProducts.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.productName}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.price}</td>
                      <td>{item.damage}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRefModal}>
            Close
          </Button>
          <Button
            variant="primary"
            disabled={!shippingAddress || addedRefProducts.length === 0}
            onClick={() => {
              // Submit logic here
              handleCloseRefModal();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderDetails;