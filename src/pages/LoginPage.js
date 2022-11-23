import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer'
import { baseURL } from '../services/api';
import logoPrisma from '../assets/img/logo-prisma.png';
import Cookies from 'js-cookie';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      }
      setLoading(true);
      const { data } = await axios.post(`${baseURL}/api/instagram/users/login`, { email: email, password: password }, config)
      Cookies.set("userData", JSON.stringify(data), { expires: 1 / 48 })
      setLoading(false)
      navigate('/')
    } catch (error) {
      console.log(error)
      setMessage("user not found!")
    }
  }

  useEffect(() => {
    let data = Cookies.get('userData');
    if (!data) {
      navigate('/login')
    } else {
      navigate('/')
    }
  }, [])

  return (
    <section>
      <FormContainer>
        <div className='col text-center mt-3'>
          <img src={logoPrisma} alt="logo" width={500} height={125} style={{ objectFit: 'contain' }} />
        </div>
        <h2 className='text-center text-white mt-5'>SCRAPING HASHTAG FROM INSTAGRAM</h2>
        <h6 className='text-center text-white'>For scraping all of the images in the hashtag</h6>
        <hr />
        {!message ? null : (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}
        <form className='needs-validation' noValidate onSubmit={submitHandler}>
          <div className='form-group mb-3'>
            <label className='text-white'>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Enter email" required />
          </div>
          <div className='form-group mb-3'>
            <label className='text-white'>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Enter password" required />
          </div>
          <button type='submit' className='btn w-100 mt-2' disabled={loading} style={{ background: '#005A55', color: 'white' }}>{`${loading ? 'Loading...' : 'LOGIN'}`}</button>
        </form>
      </FormContainer>
    </section>
  )
}

export default LoginPage