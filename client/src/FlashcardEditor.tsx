import React, { Component, ChangeEvent, MouseEvent } from "react";
import './FlashcardEditor.css'

type FlashcardEditorState = {
    name: string
    errorMessage: string
    cards: string
    saveMess: JSX.Element
    saved: boolean
    overwrite: JSX.Element
    cancel:  JSX.Element
}

type FlashcardEditorProps = {
    deck: [string, string][]
    links: string[]
    name: string
    home: () => void
    save: (name: string, deck: [string, string][], raw: string) => void,
    cards: string
    view: () => void
}

/** Displays the UI of the Flashcard application. */
export class FlashcardEditor extends Component<FlashcardEditorProps, FlashcardEditorState> {

    constructor(props: FlashcardEditorProps) {
        super(props);

        this.state = {
            name: this.props.name,
            cards: this.props.cards,
            errorMessage: "",
            saveMess: <p></p>,
            saved: true,
            overwrite: <p></p>,
            cancel: <></>
        };
    }

    render = (): JSX.Element => {
        return (
            <div className="flashcard-editor">
                <div className="label-container">
                    <label htmlFor="name">Deck Name: </label>
                    <input
                        type="text"
                        id="name"
                        value={this.state.name}
                        onChange={this.doNameChange}
                        placeholder="Enter a deck name"
                        maxLength={30}
                    />
                </div>
                <div className="textarea-container">
                    <label>One card per line, formatted as front|back</label>
                    <p></p>
                    <textarea
                        spellCheck="false"
                        id="textbox"
                        rows={10}
                        value={this.state.cards}
                        onChange={this.doCardChange}
                        className="textarea"
                        placeholder="Enter your flashcards here..."
                    />
                </div>
                <div className="save-message">
                    {this.state.saveMess}
                </div>
                <p>After saving, press "View" to play the cards!</p>
                <div className="button-container">
                    <button
                        onClick={this.doSaveClick}
                        className="save-button"
                    >
                        Save
                    </button>
                    <button
                        onClick={this.doViewClick}
                        className="view-button"
                    >
                        View
                    </button>
                    <button onClick={this.doHomeClick} className="back-button">
                        Back
                    </button>
                </div>
                <label className="error-message">{this.state.errorMessage}</label>
                <p>{this.state.overwrite} {this.state.cancel}</p>

            </div>
        )
    };

    /** Changes the name of the deck */
    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({overwrite: <p></p>, name: evt.target.value, cancel: <></>,
                saved: false, saveMess: <p style={{color: 'red'}}>Not Saved</p>, errorMessage: ""});
    };

    /** Goes to homepage */
    doHomeClick = (_event: MouseEvent<HTMLButtonElement>): void => {
        this.props.home();
    }

    /** Updates the flashcards */
    doCardChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
       this.setState({cards: evt.target.value, saved: false, cancel: <></>,
           errorMessage: "", saveMess: <p style={{color: 'red'}}>Not Saved</p>, overwrite: <p></p>});
    };

    /** Saves the current deck */
    doSaveClick = (_event: MouseEvent<HTMLButtonElement>): void => {
        if(this.state.name.trim().length == 0) {
            this.setState({errorMessage: "Error: Deck not named"})
            return
        }
        const deck: [string, string][] = []
        const cards: string[] = this.state.cards.split('\n')
        if(cards[0] == "" && cards.length === 1) {
            this.setState({errorMessage: "Error: Enter at least 1 card"})
            return
        }
        for(const card of cards) {
            if(card === "") {
                continue
            }
            const sides: string[] = card.split('|')
            if(sides.length !== 2 || sides[0].trim().length === 0 || sides[1].trim().length === 0) {
                this.setState({errorMessage: "Error: Cards not in correct format, check line " + (deck.length + 1)+"."})
                return
            } else {
                deck.push([sides[0].trim(), sides[1].trim()])
            }
        }
        if(this.props.links.indexOf(this.state.name) !== -1) {
            this.setState({
                overwrite:<button className="overwrite-button" onClick={() => this.doOverwriteClick(deck)}>Overwrite</button>,
                cancel: <button className="back-button" onClick={this.doCancelClick}>Cancel</button>,
                errorMessage: "Deck already exists. Do you want to overwrite?"
            })
        } else {
        this.props.save(this.state.name, deck, this.state.cards)
        this.setState({saved: true, saveMess: <p style={{color: 'green'}}>Saved</p>})
        }
    }

    /** Opens the viewer for the current deck */
    doViewClick = (): void => {
        if(!this.state.saved || this.state.name === "") {
            this.setState({errorMessage: "Save your cards first!", saveMess: <p style={{color: 'red'}}>Not Saved</p>})
        } else {
            this.props.view()
        }
    }

    /** Handles overwrite click */
    doOverwriteClick = (deck: [string, string][]) : void => {
        this.props.save(this.state.name, deck, this.state.cards)
        this.setState({saved: true, cancel: <></>,
            saveMess: <p style={{color: 'green'}}>Saved</p>, overwrite: <p></p>, errorMessage:""})
    }

    /** Handles cancel click */
    doCancelClick = () : void => {
        this.setState({overwrite: <p></p>, saved: false, cancel: <></>,
            saveMess: <p style={{color: 'red'}}>Not Saved</p>, errorMessage: ""});
    }
}
