
import { useParams } from 'react-router-dom';
import ProductDetails from "../../components/product/ProductDetails";

const ProductPage = () => {

  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id!, 10);
    return (
        <>
          <ProductDetails productId={productId} />
        </>
        
    );
  };
  
  export default ProductPage;