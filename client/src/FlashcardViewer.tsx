import React, {Component, MouseEvent} from "react";
import './FlashcardViewer.css'

type FlashcardViewerState = {
    score: number
    currentCard: number
    side: number
    cardOrder: number[]
    shuffled: boolean
}

type FlashcardViewerProps = {
    name: string
    cards: [string, string][]
    result: (score: number) => void
}

/** Displays the UI of the Flashcard application. */
export class FlashcardViewer extends Component<FlashcardViewerProps, FlashcardViewerState> {

    constructor(props: FlashcardViewerProps) {
        super(props);

        const order: number[] = []
        for(const index of props.cards) {
            index;
            order.push(order.length)
        }

        this.state = {
            score:0,
            currentCard:0,
            side: 0,
            cardOrder: order,
            shuffled: false
        };
    }

    render = (): JSX.Element => {
        return (
            <div className="flashcard-viewer">
                <label className="label">{this.props.name}</label>
                <p></p>
                <div className="button-container">
                    <p></p>
                    <label> Click the card to flip! </label>
                    <p></p>
                    <p className="card" onClick={this.doFlipClick}>
                        {this.doSideChange() + ": " + this.doCardChange()}
                    </p>
                    <p></p>
                    <button onClick={this.doShuffleClick} className="shuffle-button">
                        Shuffle
                    </button>
                    <button onClick={this.doCorrectClick} className="correct-button">
                        Correct
                    </button>
                    <button onClick={this.doIncorrectClick} className="incorrect-button">
                        Incorrect
                    </button>
                </div>
            </div>

        )
    };

    /** Renders current card text */
    doCardChange = (): string | undefined => {
        return this.props.cards[this.state.cardOrder[this.state.currentCard]][this.state.side]
    }

    /** Displays current card side */
    doSideChange = (): string => {
        if (this.state.side) {
            return "Back"
        } else {
            return "Front"
        }
    }

    /** Flips current card */
    doFlipClick = (_evt: MouseEvent<HTMLParagraphElement>): void => {
        this.setState({side: 1 - this.state.side})
    }

    /** Marks current card as correct */
    doCorrectClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.setState({score: this.state.score + 1})
        if (this.state.currentCard === this.props.cards.length - 1) {
            this.props.result(this.state.score + 1)

        } else {
            this.setState({currentCard: this.state.currentCard + 1, side: 0})
        }
    }

    /** Marks current card as incorrect */
    doIncorrectClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if(this.state.currentCard === this.props.cards.length - 1) {
            this.props.result(this.state.score)
        } else {
            this.setState({currentCard: this.state.currentCard + 1, side: 0})
        }
    }

    /** Shuffles the deck */
    doShuffleClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.setState(
            { cardOrder: this.state.cardOrder.sort(() => Math.random() - 0.5)})
    }
}
