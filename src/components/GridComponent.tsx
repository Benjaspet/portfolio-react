import React from 'react';
import '../css/GridComponent.css';

const GridComponent: React.FC = () => {
    const texts = [
        'Text 1',
        'Text 2',
        'Text 3',
        'Text 4',
        'Text 5',
        'Text 6',
    ];

    return (
        <div className="grid-container">
            {texts.map((text, index) => (
                <div className="grid-item" key={index}>
                    {text}
                </div>
            ))}
        </div>
    );
};

export default GridComponent;
