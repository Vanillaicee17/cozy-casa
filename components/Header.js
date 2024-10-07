import React from 'react'

const Header = () => {
  return (
    <>
  <header className="text-gray-600 body-font">
    <div className="container mx-auto flex p-5 flex-col md:flex-row items-center">
      <a href={"/"} className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-pink-500 rounded-full" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        <span className="ml-3 text-xl text-black ">Cozy-Casa Livin</span>

      </a>
      <a href={"/addproduct"} className="ml-auto inline-flex items-center bg-violet-300 border-0 py-1 px-3 focus:outline-none hover:bg-violet-200 rounded text-base mt-4 md:mt-0">
        Add Product
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </a>
    </div>
  </header>

    </>
  )
}

export default Header