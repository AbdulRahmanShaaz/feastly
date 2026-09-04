import { useSelector } from 'react-redux'
import { DeliveryBoy, Navbar, Owner, UserDashboard } from '../components'

function Home() {
  const { userData } = useSelector((state) => state.user)

  return (
    <>
      <Navbar />
      <main className="flex min-h-dvh w-full flex-col items-center bg-[#fff9f6] px-4 pt-28 sm:px-6 lg:px-8">
        {userData?.role === 'user' && <UserDashboard />}
        {userData?.role === 'owner' && <Owner />}
        {userData?.role === 'deliveryBoy' && <DeliveryBoy />}
      </main>
    </>
  )
}

export default Home
