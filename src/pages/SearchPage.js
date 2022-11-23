import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [hashtag, setHashtag] = useState("");
  let navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    if (hashtag.trim()) {
      navigate(`/${hashtag}`)
    } else {
      navigate('/')
    }
  }

  const userData = Cookies.get('userData');

  useEffect(() => {
    if (!userData) {
      navigate('/login')
    }
  })
  return (
    <div className='container mt-5'>
      <div className='p-3'>
        <div className='d-flex justify-content-between'>
          <h3 className='text-white'>SEARCH HASHTAG</h3>
          <Link to={'/posts'} className='btn btn-info text-white'>Cek Data</Link>
        </div>
        <form onSubmit={submitHandler}>
          <label className="form-label text-white">For scraping all of the images in the hashtag</label>
          <div className='d-flex'>
            <input className="form-control me-2" value={hashtag} autoComplete='off' type="text" onChange={(e) => setHashtag(e.target.value)} placeholder="Leave Out # eg. #prismaadvertising to prismaadvertising" />
            <button type="submit" className='btn btn-primary'>Search</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SearchPage