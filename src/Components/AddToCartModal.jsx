import React, { useContext } from "react";
import ProductDetails from "./../Pages/DetailsPage/ProductDetails";
import { addToCartContext } from "../context/AddToCartContext";

const AddToCartModal = () => {
  const { showModal, setShowModal, modalSlug } = useContext(addToCartContext);
  return (
    <div
      onClick={() => {
        setShowModal(false);
      }}
      className="fixed inset-0 lg:p-20 p-5 flex items-center justify-center bg-black/40 z-90 backdrop-blur-md"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="rounded-2xl max-h-[700px] lg:min-w-[700px] min-w-[300px] lg:max-h-[750px] overflow-y-scroll no-scroll-bar"
      >
        <ProductDetails modalSlug={modalSlug} modal={true} />
      </div>
    </div>
  );
};

export default AddToCartModal;
