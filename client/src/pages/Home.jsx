import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Category from '../components/Category'
import FeaturedProducts from '../components/FeaturedProducts'
import ClientNO from '../components/ClientNO'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Category />
      <FeaturedProducts />
      <ClientNO />
      <Footer />
    </div>
  )
}

export default Home
