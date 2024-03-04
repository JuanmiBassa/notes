import './App.css'
import imgNote3D from './assets/note3d.webp'
import { Link } from 'react-router-dom'

export default function App() {
  return (
    <>
      <section id='app-section'>
        <div id='app-container'>
          <div>
            <img id='note3D' src={imgNote3D} alt="Note 3d" />
          </div>
          <div>
            <h1>Your Creative Space for Notes!</h1>
            <h2>Text, Images and Voices.</h2>
            <div>
              <Link to="/notes" id='app-start'>START</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
