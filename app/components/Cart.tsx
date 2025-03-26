import { Product } from '../types'

interface CartProps {
  items: Product[]
  removeFromCart: (productId: number) => void
  clearCart: () => void
}

export default function Cart({ items, removeFromCart, clearCart }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="w-1/2">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul className="space-y-2 mb-4">
            {items.map(item => (
              <li key={item.id} className="flex justify-between items-center bg-white p-2 rounded shadow">
                <span>{item.name} - ${item.price}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Total: ${total}</span>
            <button
              onClick={clearCart}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

