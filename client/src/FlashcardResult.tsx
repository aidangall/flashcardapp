import React, {ChangeEvent, Component} from "react";
import './FlashcardResult.css'

type FlashcardResultState = {
    name:string
    errorMessage: string
}

type FlashcardResultProps = {
    name: string
    save: (name: string, score: number) => void
    correct: number
    incorrect: number
}

/** Displays the UI of the Flashcard application. */
export class FlashcardResult extends Component<FlashcardResultProps, FlashcardResultState> {

    constructor(props: FlashcardResultProps) {
        super(props);

        this.state = {
            name: "",
            errorMessage: ""
        };
    }

    render = (): JSX.Element => {
        return (
            <div className="flashcard-result">
                <label className="label">{this.props.name}</label>
                <p></p>
                <label className="stats">
                    {"Correct: " + this.props.correct + " | Incorrect: " + this.props.incorrect}
                </label>
                <p></p>
                <div className="input-container">
                    <input
                        type="text"
                        id="name"
                        value={this.state.name}
                        onChange={this.doNameChange}
                        className="input"
                        placeholder="Enter your name"
                    />
                </div>
                <div className="button-container">
                    <button onClick={this.doSaveClick} className="button">
                        Save
                    </button>
                </div>
                <label className="error-message" style={{color: "red"}}>
                    {this.state.errorMessage}
                </label>
            </div>
        )
    };


    /** Changes name */
    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({name: evt.target.value, errorMessage: ""});
    };

    /** Saves score */
    doSaveClick = (): void => {
        if (this.state.name.trim().length < 1) {
            this.setState({errorMessage: "Invalid Name"})
        } else {
            const score: number = Math.round((this.props.correct / (this.props.correct + this.props.incorrect)) * 100)
            this.props.save(this.state.name, score)
        }
    }
}
