import React, { Component } from "react";
import { isRecord } from './record';
import { FlashcardHome } from "./FlashcardHome";
import { FlashcardEditor } from "./FlashcardEditor";
import { FlashcardViewer } from "./FlashcardViewer";
import { FlashcardResult } from "./FlashcardResult";

type FlashcardAppState = {
  page: "home" | "editor" | "view" | "result",
  root: [string, string][]
  links: string[]
  scores: string[]
  rootName: string
  raw: string
  correct:number
}

/** Displays the UI of the Flashcard application. */
export class FlashcardApp extends Component<{}, FlashcardAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      page: "home",
      root: [],
      rootName: "",
      links: [],
      raw:"",
      correct: 0,
      scores: []
    };
  }
  componentDidMount = ():void => {
    this.doListClick()
    this.doListScoresChange()
  }

  render = (): JSX.Element => {
    if(this.state.page === "home") {
      return (
          <FlashcardHome
          load={this.doLoadChange}
          links={this.state.links}
          scores={this.state.scores}
          new = {this.doNewDeckClick}/>
      )
    } else if(this.state.page === "editor") {
      return (
          <FlashcardEditor
              deck={this.state.root}
              name={this.state.rootName}
              home={this.doGoHomeClick}
              save={this.doSaveClick}
              cards={this.state.raw}
              view={this.doViewClick}
              links={this.state.links}
          />
      )
    } else if(this.state.page === "view") {
      return (
          <FlashcardViewer
              cards={this.state.root}
              name={this.state.rootName}
              result={this.doResultChange}
          />
      )
    } else if(this.state.page === "result") {
      return (
          <FlashcardResult
              name={this.state.rootName}
              correct={this.state.correct}
              incorrect={this.state.root.length - this.state.correct}
              save={this.doSaveScoreClick}
          />
      )
    }
    else {
      return <ul>ERROR</ul>
    }
  };

  /** Saves the current deck
   * @param name of deck to save
   * @param deck array of cards
   * @param raw raw input from user
   * */
  doSaveClick = (name: string, deck: [string, string][], raw: string): void => {
    fetch('api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        value: [deck, raw]
      }),
    }).then(res => this.doSaveResp(name, deck, raw, res))
        .catch((_res) =>  console.error("Could not connect to server") )
  }

  /** Checks if save worked
   * @param name of deck to save
   * @param deck array of cards
   * @param raw raw input from user
   * @param res response from server
   * */
  doSaveResp = (name: string, deck: [string,string][], raw:string, res: Response): void => {
    if (res.status === 200) {
      this.setState({rootName: name, root: deck, raw: raw})
      this.doListClick()
    } else {
      console.error("Error: failed to save");
    }
  }

  /** Loads the list of saved decks */
  doListClick = (): void => {
    fetch('/api/list')
        .then(res => res.ok ? res.json() : Promise.reject(new Error("Failed to fetch list")))
        .then((data => this.doListResp(data)))
        .catch((_res) =>  console.error("Could not connect to server") )
  }

  /** Checks list response before applying change */
  doListResp = (data: unknown): void => {
    if(!isRecord(data)) {
      console.error("Incorrect type")
      return
    } else if (!Array.isArray(data.keys)) {
      console.error("Incorrect type")
      return
    } else {
      const links: string[] = []
      for(const key  of data.keys) {
        if(typeof key === "string") {
          links.push(key)
        }
      }
      this.setState({links: links})
    }
  }

  /** Loads a saved deck from the list */
  doLoadChange = (name: string): void => {
    fetch("/api/load?name=" + encodeURIComponent(name))
        .then(res => res.ok ? res.json() : Promise.reject(new Error("Failed to fetch list")))
        .then((data => this.doLoadResp(data, name)))
        .catch((_res) =>  console.error("Could not connect to server") )
  };

  /** Checks load response, the opens it*/
  doLoadResp = (data: unknown, name: string): void => {
    if(!isRecord(data)) {
      console.error("Wrong type")
      return
    }
    if(!Array.isArray(data.value)) {
      console.error("Wrong type")
      return
    }
    this.setState({root: data.value[0], page: "editor", rootName:name, raw:data.value[1]})
  }

  /** Saves a score
   * @param name of person who scored
   * @param score number of correct answers */
  doSaveScoreClick = (name: string, score: number): void => {
    fetch('api/saveScores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: name + ", " + this.state.rootName + ": " + score
      }),
    }).then(res => this.doSaveScoreResp(res))
        .catch((_res) =>  console.error("Could not connect to server") )
  }

  /** Checks if save worked, then returns home*/
  doSaveScoreResp = (res: Response): void => {
    if (res.status === 200) {
      this.doListClick()
      this.doListScoresChange()
      this.setState({page: "home"})
    } else {
      console.error("Failed to save score");
    }
  }

  /** Loads the list of saved scores */
  doListScoresChange = (): void => {
    fetch('/api/listScores ')
        .then(res => res.ok ? res.json() : Promise.reject(new Error("Failed to fetch list")))
        .then((data => this.doListScoresResp(data)))
        .catch((_res) =>  console.error("Could not connect to server") )
  };

  /** Checks list response before applying change */
  doListScoresResp = (data: unknown): void => {
    if(!isRecord(data)) {
      console.error("Incorrect type")
      return
    } else if (!Array.isArray(data.keys)) {
      console.error("Incorrect type")
      return
    } else {
      const flashcards: string[] = []
      for(const key  of data.keys) {
        if(typeof key === "string") {
          flashcards.push(key)
        }
      }
      this.setState({scores: flashcards})
    }
  }

  /** Creates a new deck */
  doNewDeckClick = (): void => {
    this.setState({rootName:"", root:[], page: "editor", raw: ""})
  }

  /** Returns to home page */
  doGoHomeClick = (): void => {
    this.setState({rootName:"", root: [], page: "home"})
    this.doListClick()
    this.doListScoresChange()
  }

  /** Opens the deck viewer  */
  doViewClick = (): void => {
    this.setState({page:"view"})
  }

  /** Opens the result viewer
   * @param correct number of flashcards guessed correctly */
  doResultChange = (correct: number): void => {
    this.setState({page: "result", correct: correct})
  }
}
