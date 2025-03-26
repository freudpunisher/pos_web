import { Product } from '../types'

const products: Product[] = [
  { id: 1, name: 'Product 1', price: 10 },
  { id: 2, name: 'Product 2', price: 15 },
  { id: 3, name: 'Product 3', price: 20 },
]

interface ProductListProps {
  addToCart: (product: Product) => void
}

export default function ProductList({ addToCart }: ProductListProps) {
  return (
    <div className="w-1/2">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <ul className="space-y-4">
        {products.map(product => (
          <li key={product.id} className="flex justify-between items-center bg-white p-4 rounded shadow">
            <span>{product.name} - ${product.price}</span>
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

