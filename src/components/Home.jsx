import React from 'react'
import Hero from '../pages/Hero'
import Footer from './Footer'
import Category from '../pages/Category'
import Action from '../pages/BestSeller'
import BestSeller from '../pages/BestSeller'
import Box from '../pages/Box'
import Testimonials from '../pages/Testimonials'
import ReviewForm from '../pages/ReviewForm'

const Home = () => {
  return (
    <section>
      <Hero />
      <Category />
      <BestSeller />
      <Box />
      <Testimonials />
      <ReviewForm />
      <Footer />  
    </section>
  )
}

export default React.memo(Home)
