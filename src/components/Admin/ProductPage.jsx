import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, Edit, Clock, Eye, EyeOff, Home } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [loadingId, setLoadingId] = useState(null);
    const [editingProductId, setEditingProductId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const formRef = useRef(null);
    const historyModalRef = useRef(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("https://srkvm.vercel.app/api/auth/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products", error);
            toast.error("Failed to fetch products");
        }
    };

    const handleAddOrUpdateProduct = async (e) => {
        e.preventDefault();
        if (!name || !quantity) {
            toast.warn("All fields are required");
            return;
        }

        setIsLoading(true);
        const token = localStorage.getItem("token");
        const productData = { name, quantity: Number(quantity) };

        try {
            if (editingProductId) {
                const response = await axios.put(
                    `https://srkvm.vercel.app/api/auth/products/${editingProductId}`,
                    productData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success(response.data.message || "Product updated successfully");
            } else {
                const response = await axios.post(
                    "https://srkvm.vercel.app/api/auth/products",
                    productData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success(response.data.message || "Product added successfully");
            }

            setName("");
            setQuantity("");
            setEditingProductId(null);
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error processing request");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProduct = (product) => {
        setName(product.name);
        setQuantity("");
        setEditingProductId(product._id);
        formRef.current.scrollIntoView({ behavior: "smooth" });
    };

    const handleDeleteProduct = async (id) => {
        setLoadingId(id);
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://srkvm.vercel.app/api/auth/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchProducts();
            toast.success("Product deleted successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting product");
        } finally {
            setLoadingId(null);
        }
    };

    const handleViewHistory = async (product) => {
        setSelectedProduct(product);
        
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `https://srkvm.vercel.app/api/auth/history/${product.name}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setHistory(response.data.history);
        } catch (error) {
            console.error("Error fetching history", error);
            setHistory([]);
        }

        if (historyModalRef.current) {
            historyModalRef.current.showModal();
        }
    };

    const handleToggleVisibility = async (product) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `https://srkvm.vercel.app/api/auth/products/${product._id}/toggle-visibility`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchProducts();
            toast.success(response.data.message || "Product visibility updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating visibility");
        }
    };

    return (
        <div className="h-screen overflow-auto p-6 relative" data-theme="fantasy">
          <ToastContainer position="top-right" autoClose={3000} />
          
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white shadow-md p-4 text-center">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold">SARVEPALLI RADHAKRISHNAN VIDYARTHI MITRA</h1>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold">KOTANANDURU MANDAL</h2>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold">Product Management</h2>
          </div>
          
          {/* Form */}
          <form ref={formRef} onSubmit={handleAddOrUpdateProduct} className="my-4 flex flex-col sm:flex-row items-center gap-3">
            <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className="p-3 border rounded-md w-[90%] sm:w-[45%] input input-bordered" readOnly={!!editingProductId} />
            {editingProductId && (
              <input type="number" placeholder="Current Available" value={products.find((p) => p._id === editingProductId)?.quantity || 0} className="p-3 border rounded-md w-[90%] sm:w-[30%] input input-bordered bg-gray-200" readOnly />
            )}
            <input type="number" placeholder="New Stock Adding" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="p-3 border rounded-md w-[90%] sm:w-[30%] input input-bordered" />
            <button type="submit" className="btn btn-primary w-[90%] sm:w-auto" disabled={loadingId !== null}>{loadingId ? <span className="loading loading-spinner"></span> : editingProductId ? "Update Stock" : "Add Product"}</button>
          </form>
          
          {/* Product List */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto">
            {products.map((product) => (
              <div key={product._id} className="p-3 border rounded bg-white shadow-md flex flex-col justify-between">
                <div className="mb-2">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-gray-600">{product.quantity} items</p>
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={() => handleViewHistory(product)} className="btn btn-outline btn-success btn-xs"><Clock size={16} /></button>
                  <button onClick={() => handleEditProduct(product)} className="btn btn-outline btn-primary btn-xs"><Edit size={16} /></button>
                  <button onClick={() => handleToggleVisibility(product)} className={`btn btn-xs ${product.visibility ? "bg-transparent text-green border border-gray-400" : "bg-red-600 text-white"}`}>
                    {product.visibility ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => handleDeleteProduct(product._id)} className="btn btn-outline btn-error btn-xs" disabled={loadingId === product._id}>
                    {loadingId === product._id ? <span className="loading loading-spinner"></span> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* History Modal */}
          <dialog ref={historyModalRef} className="modal">
            <div className="modal-box">
              <h3 className="text-lg font-bold">History for {history?.name}</h3>
              {history.length > 0 ? (
                <ul>{history.map((item, index) => <li key={index}>{item.timestamp} - {item.comment} ({item.beforeQuantity} ➝ {item.afterQuantity})</li>)}</ul>
              ) : (
                <p className="text-gray-500">No history available</p>
              )}
              <button onClick={() => historyModalRef.current?.close()} className="btn btn-outline btn-error mt-4">Close</button>
            </div>
          </dialog>
        </div>
      );
    };

export default ProductPage;
