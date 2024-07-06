import { useNavigate } from 'react-router-dom'

const HomePage = (props) => {
    const navigate = useNavigate()

    return (
        <div onClick={() => navigate('/about')}>HomePage</div>
    )
}

export default HomePage
