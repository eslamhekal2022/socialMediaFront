import React from 'react'

import CategoryProduct from '../CategoryProduct/CategoryProduct.jsx'
import HeroSection from '../Banner/HeroSec.jsx'
import ReviewUsers from '../ReviewUsers/ReviewUsers.jsx'

export default function Home() {
  return (
    <div>  
        <HeroSection />
        <CategoryProduct/>
        <ReviewUsers/>
    </div>
  )
}
