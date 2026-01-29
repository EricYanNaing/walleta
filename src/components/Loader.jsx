import React from 'react'
import useLoadingStore from '../store/useLoadingStore'

const Loader = () => {
    const isLoading = useLoadingStore((state) => state.isLoading);

    if (!isLoading) return null;

    return (
        <div className="loader-overlay">
            <div className="loader-container">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    )
}

export default Loader