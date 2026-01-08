import React, { Component } from 'react';

class WelcomeMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: true,
        };
    }

    toggleVisibility = () => {
        this.setState((prevState) => ({
            isVisible: !prevState.isVisible,
        }));
    };

    render() {
        return (
            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-100 text-center mb-6">
                <h2 className="text-xl font-bold text-indigo-900 mb-2">Welcome (Class Component)</h2>
                {this.state.isVisible && (
                    <p className="text-indigo-700 mb-4">
                        Components are the building blocks of React applications. This is a Class Component example!
                    </p>
                )}
                <button
                    onClick={this.toggleVisibility}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                    {this.state.isVisible ? 'Hide Message' : 'Show Message'}
                </button>
            </div>
        );
    }
}

export default WelcomeMessage;
