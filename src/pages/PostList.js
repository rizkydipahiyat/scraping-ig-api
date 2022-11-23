import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiURL, baseURL, options } from '../services/api';

const PostList = () => {
  const hashtag = useParams();
  const tag = hashtag.hashtag;
  const [posts, setPosts] = useState({});
  const [tagName, setTagName] = useState(tag);
  const [transition, setTransition] = useState(0);
  const [grid, setGrid] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState([]);
  const [noOfElement, setnoOfElement] = useState(10);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await axios.get(`${apiURL}/hash_tag_medias?hash_tag=${tag}`, options)
    setPosts(data)
  }

  const userData = Cookies.get('userData');


  useEffect(() => {
    if (!userData) {
      navigate('/login')
    }
  })

  useEffect(() => {
    fetchData()
  }, [])

  const slice = posts?.data?.hashtag?.edge_hashtag_to_media?.edges?.slice(0, noOfElement);
  const loadMore = () => {
    setnoOfElement(noOfElement + noOfElement)
  }

  const handleCheck = (event) => {
    const { target } = event;
    var updateList = checked;
    if (target.checked) {
      let decodeData = JSON.parse(decodeURIComponent(escape(window.atob(target.value))));
      let dataBaru = {
        'id': decodeData.node.owner.id,
        'image_url': decodeData.node.display_url,
        'like_count': decodeData.node.edge_liked_by.count,
        'caption': decodeData.node.edge_media_to_caption.edges[0].node.text,
      }
      updateList.push(dataBaru);
    }
    setChecked(updateList)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    }
    setLoading(true)
    await axios.post(`${baseURL}/api/instagram/event`, { hashtag: tagName, transition: transition, grid: grid, data_instagram: JSON.stringify(checked) }, config)
    setLoading(false)
    navigate('/posts')
  }

  const handleRefresh = () => {
    window.location.reload(false);
  }

  const handleLogout = (e) => {
    e.preventDefault();
    Cookies.remove('userData');
    navigate('/login')
  }

  return (
    <div className='container mt-5 mb-5'>
      <div className='d-flex m-4'>
        <button className='btn btn-info me-2' style={{ width: '150px' }}>
          <Link to={'/posts'} className="text-white" style={{ textDecoration: 'none' }}>Preview Data</Link>
        </button>
        <button className='btn btn-warning me-2' style={{ width: '150px' }} onClick={handleRefresh}>
          Reload
        </button>
        <button className='btn btn-dark' style={{ width: '150px' }} onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className='row p-4'>
        <div className='col'>
          <label className='text-white'>GRID: </label>
          <select className="form-select" id="floatingSelect" aria-label="Floating label select example"
            onChange={(e) => {
              const selectedGrid = e.target.value;
              setGrid(selectedGrid)
            }}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="6">6</option>
          </select>
        </div>
        <div className='col'>
          <label className='text-white'>TRANSITION (s): </label>
          <select className="form-select" id="floatingSelect" aria-label="Floating label select example" onChange={(e) => {
            const selectedTransition = e.target.value;
            setTransition(selectedTransition)
          }}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        <h1 className='mt-3 mb-3 text-white' value={tagName} onChange={(e) => setTagName(e.target.value)}>#PRISMAADVERTISING</h1>
        {
          slice && slice.map((post, i) => {
            let dataCheckbox = btoa(unescape(encodeURIComponent(JSON.stringify(post))));
            return (
              <div className='col-lg-3 mb-4' key={i}>
                <img src={`https://cors-anywhere.herokuapp.com/${post?.node?.display_url}`} width="250px" height={'310px'} alt={i} crossOrigin='' />
                <h6 className='text-white'>Like: {post?.node?.edge_liked_by?.count}</h6>
                <h6 className='text-white'>
                  {post?.node?.edge_media_to_caption?.edges[0]?.node?.text.substring(0, 25)}
                </h6>
                <input
                  value={dataCheckbox}
                  type="checkbox"
                  onChange={handleCheck}
                  className='mb-3'
                />
              </div>
            )
          })
        }
        <button className='btn btn-info w-100 text-white' onClick={() => loadMore()}>
          <strong>Load More</strong>
        </button>
        <div>
          <button type='submit' className='btn btn-sm btn-info mt-2' onClick={handleSubmit}>PUBLISH</button>
        </div>
      </div>
    </div>
  )
}

export default PostList