import { useState, useEffect, Suspense, lazy } from 'react'
import axios from 'axios'
import './App.css'
import ErrorBoundary from './ErrorBoundary'

const Posts = ({data, deletePost}) => (
  <ul>
      {
        data && data.map((post, _) => (
          <li key={post.id}>
            <span>
              <h3>Title: {post.title}</h3>
              <p><b>Body:</b>&nbsp;{post.body}</p>
              <button onClick={deletePost(post.id)}>Delete</button>
            </span>
          </li>
        ))
      }
  </ul>
)

function App() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  // lazy should return a promise in order to work with suspense
  // as suspense works with promises
  // So, I will create promise that resolves with the posts component
  // I am setting timeout here to 3 secs
  const LazyPosts = lazy(() => new Promise((resolve) => setTimeout(() => {
    resolve({default: Posts})
  }, 3000)))

  const apiBoilerPlate = async () => {
    return await axios ({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts'
    })
  }

  useEffect(() => {
    apiBoilerPlate().then((res) => {
      setData(res.data)
      setIsLoading(false)
    }).catch((err) => {
      console.log(err)
      setIsError(true)
    })}, [])
  
  useEffect(() => {
    if(isError) {
      throw new Error("Something crashed ...");
    }
  }, [isError])

  {console.log("data", data)}

  const deletePost = (id) => () => {
    setData(data => (
     data.filter((post) => {
      if(post.id !== id)
        return post
    })
    ))
  }

  return (
    <>
      <h2>
      Posts List
      </h2>
        <div id="post_container">
          {
            // suspense does not work with API calls
            // for it to work I am making posts a lazy component
            <Suspense fallback={<div id="loader">Loading ...</div>}>
              { !isLoading && <LazyPosts data={data} deletePost={deletePost} /> }
            </Suspense>
          }
        </div>
    </>
  )
}

export default App
