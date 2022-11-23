import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useSWR, { useSWRConfig } from 'swr'
import { Modal, Button, Form } from 'react-bootstrap';
import Pagination from '../components/Pagination';
import Cookies from 'js-cookie';
import { baseURL } from '../services/api';

const TablePosts = () => {
  const [show, setShow] = useState(false);
  const [grid, setGrid] = useState("");
  const [transition, setTransition] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  const { mutate } = useSWRConfig();
  const navigate = useNavigate();
  const fetcher = async () => {
    const response = await axios.get(`${baseURL}/api/instagram/event`)
    return response.data
  }

  const handleClose = () => setShow(false);
  const handleShow = async (id) => {
    const { data } = await axios.get(`${baseURL}/api/instagram/event/${id}`)
    setGrid(data[0].grid);
    setTransition(data[0].transition);
    setUpdateId(data[0].id)
    setShow(true)
  };

  const { data } = useSWR("event", fetcher);
  if (!data) return (
    <div className='p-5'>
      <div className="d-flex align-items-center">
        <strong className='text-white'>Loading...</strong>
        <div className="spinner-border ms-auto text-white" role="status" aria-hidden="true"></div>
      </div>
    </div>
  )

  const handleDeleteItem = async (postId) => {
    if (window.confirm("Yakin ingin hapus data?")) {
      await axios.get(`${baseURL}/api/instagram/event/delete/${postId}`)
      mutate("event")
    }
  }

  const handleUpdate = async (e) => {
    setLoading(true)
    e.preventDefault();
    await axios.post(`${baseURL}/api/instagram/event/${updateId}`, {
      grid: grid,
      transition: transition
    })
    mutate("event")
    setLoading(false);
    setShow(false)
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const userData = Cookies.get('userData');

  if (!userData) return (
    navigate('/login')
  )

  return (
    <section>
      <div className='p-5'>
        <button className='btn btn-dark'>
          <Link to={'/'} className='text-white' style={{ textDecoration: 'none' }}>Cari lagi...</Link>
        </button>
        <table className='table table-striped mt-3'>
          <thead className='table-dark text-center'>
            <tr>
              <td>NO</td>
              <td>EVENT</td>
              <td>HASHTAG</td>
              <td>GRID</td>
              <td>PHOTOS</td>
              <td>TRANSITION</td>
              <td>ACTION</td>
            </tr>
          </thead>
          <tbody className='bg-white text-center'>
            {data && currentPosts.map((post, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{post.event}</td>
                <td>#{post.hashtag}</td>
                <td>{post.grid}</td>
                <td>{JSON.parse(post.data_instagram).length}</td>
                <td>{post.transition}</td>
                <td>
                  <button className='btn btn-sm btn-info'>
                    <a href={`${baseURL}/${post.id}`} target="_blank" rel="noopener noreferrer" className='text-white' style={{ textDecoration: 'none' }}>DISPLAY</a>
                  </button>
                  {" "}
                  <Button className='btn btn-sm btn-warning' onClick={() => handleShow(post.id)}>
                    EDIT
                  </Button>

                  {" "}
                  <button className='btn btn-sm btn-danger' onClick={() => handleDeleteItem(post.id)}>
                    <Link className='text-white' style={{ textDecoration: 'none' }}>DELETE</Link>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination postsPerPage={postsPerPage} totalPosts={data.length} paginate={paginate} />
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id="insertForm">
              <Form.Group controlId="grid">
                <Form.Label>GRID</Form.Label>
                <Form.Select value={grid} onChange={(e) => {
                  const selectedGrid = e.target.value;
                  setGrid(selectedGrid)
                }}>
                  {/* <option value={grid}>{grid}</option> */}
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="transition" className='mt-2 mb-3'>
                <Form.Label>TRANSITION</Form.Label>
                <Form.Select value={transition} onChange={(e) => {
                  const selectedTransition = e.target.value;
                  setTransition(selectedTransition)
                }}>
                  {/* <option value={transition}>{transition}</option> */}
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
                </Form.Select>
              </Form.Group>
              <Button variant="primary" onClick={handleUpdate} disabled={loading}>{`${loading ? 'Loading...' : 'Save Changes'}`}</Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </section>
  )
}

export default TablePosts