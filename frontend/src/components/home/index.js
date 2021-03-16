import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

import "./home.css";

const GenresList = (props) => {
  return (
    <NavLink
      // to={`/book/${props.book.id}`}
      to={`/genres/215412`}
      className="genres__list-card"
      // onMouseEnter={() => onMouseEnter()}
      // onMouseLeave={() => onMouseLeave()}
    >
      <div className="genres__list-card-title">
        <div className="text-card-genre">{props.genre}</div>
      </div>
    </NavLink>
  );
};

const BooksList = (props) => {
  // function onMouseEnter() {
  // var target = document.querySelector(`#`)
  // }

  return (
    <NavLink
      // to={`/book/${props.genre.id}`}
      to={`/book/1234`}
      className="books__list-card"
      // onMouseEnter={() => onMouseEnter()}
      // onMouseLeave={() => onMouseLeave()}
    >
      <div className="page__list__card-img">
        <img
          className="image-card"
          src="https://loremflickr.com/360/640"
          alt="background"
          // src={props.book.image}
          // alt={`${props.book.name} background`}
        />
      </div>
      <div className="books__list-card-title">
        <div className="text-card">
          {props.book}
          {props.book.name}
        </div>
      </div>
    </NavLink>
    // <div className="book-card">
    //   <div className="book-card-img">
    //     <img
    //       className="image-card"
    //       src="https://loremflickr.com/360/640"
    //       alt="placeholder"
    //     ></img>
    //   </div>
    //   <div className="book-card-text">
    //     <h3 className="text-card">{props.book}</h3>
    //   </div>
    // </div>
  );
};

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [
        "SHREK TERCERO ",
        "SHREK TERCERO EPILOGO",
        "SHREK DOS EPILOGO",
        "SHREK UNO EPILOGO",
        "SHREK UNO",
        "SHREK DOS",
        "AAAAA",
        "TRANSFORMERS",
        "EJEMPLO TEXTO",
        "SAMPLE TEXT",
        "DANK MEMES 2021",
        "SHREK",
        "SHREK MORRON",
        "MECAGUEN DIOS",
        "SHITPOSTING",
      ],
      genres: [
        "Action",
        "Action",
        "Action",
        "Action",
        "Action",
        "Action",
        "Action",
        "Action",
        "Action",
        "Action",
        "Action",
        "Action",
      ],
    };
  }

  renderGenres() {
    return this.state.genres.map((value) => {
      return <GenresList genre={value} />;
    });
  }

  renderBooks() {
    return this.state.books.map((value) => {
      return <BooksList book={value} />;
    });
  }
  render() {
    return (
      <div className="content">
        <div className="test">
          <div className="content-genres">
            <div className="genres__list">{this.renderGenres()}</div>
          </div>
          <div className="content-books">
            <div className="books__list">{this.renderBooks()}</div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
