import React, { Component, MouseEvent } from "react";
import './FlashcardHome.css'

type FlashcardHomeState = {
}

type FlashcardHomeProps = {
    load: (name: string) => void;
    new: () => void;
    links: string[]
    scores: string[]
}

/** Displays the UI of the Flashcard application. */
export class FlashcardHome extends Component<FlashcardHomeProps, FlashcardHomeState> {

    constructor(props: FlashcardHomeProps) {
        super(props);

        this.state = {
        };
    }

    render = (): JSX.Element => {
        return (
            <div className="flashcard-home">
                <p style={{fontWeight: "bold", fontSize:"24px"}}>Saved Flashcards:</p>
                <ul className="flashcard-list">{this.doLinkChange()}</ul>
                <p></p>
                <button className="flashcard-button" onClick={this.doNewClick}>Add</button>
                <p style={{fontWeight: "bold", fontSize:"24px"}}>Saved Scores:</p>
                <ul className="flashcard-list">{this.doScoresChange()}</ul>
            </div>
        )
    };

    /** Displays names of saved dekcs with links */
    doLinkChange = (): JSX.Element[] | JSX.Element => {
        const links: JSX.Element[] = []
        if(this.props.links.length === 0) {
            return <>No flashcards saved</>
        }
        for (const name of this.props.links) {
          links.push(
              <li>
                <a className="flashcard-link" href="#"
                   onClick={this.doLoadClick.bind(this, name)}> {name}</a>
              </li>
          )
        }
        return links
    }

    /** Displays saved scores */
    doScoresChange = (): JSX.Element[] | JSX.Element => {
        const scores: JSX.Element[] = []
        if(this.props.scores.length === 0) {
            return <>No Scores Saved</>
        }
        for (const name of this.props.scores) {
            scores.push(
                <li className="flashcard-list-item">
                    <a >{name}</a>
                </li>
            )
        }
        return scores
    }

    /** Loads a saved deck from the list */
    doLoadClick = (name: string): void => {
        this.props.load(name);
    }

    /** Creates a new deck */
    doNewClick = (_event: MouseEvent<HTMLButtonElement>): void => {
        this.props.new()
    }
}
