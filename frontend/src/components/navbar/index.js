import React, { Component } from "react";
import { connect } from "react-redux";
import { get_books } from "../../actions";
import { NavLink } from "react-router-dom";

import "./navbar.css";

export class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: "",
    };
  }

  render() {
    const { book } = this.state;

    return (
      <header className="header page__header">
        <div className="header__item">
          <NavLink className="header__item-link header-logo" to="/">
            <div className="logo">LIBRARY</div>
          </NavLink>
        </div>
        <div className="header__item">
          <div className="header__searchbar-item">
            <div className="page__form">
              <form
                className="page__search__form"
                onSubmit={(e) => this.handleSubmit(e)}
                role="search"
              >
                <div className="page__search__input__area">
                  <input
                    type="text"
                    id="book"
                    className="page__form-input"
                    placeholder="El principito..."
                    autoFocus={true}
                    autoComplete="off"
                    value={book}
                    onChange={(e) => this.handleChange(e)}
                    onKeyPress={(e) => this.handleKeyPress(e)}
                  />
                </div>
                <button className="page__form-submit" type="submit">
                  search
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="header__item">
          <NavLink className="header__item-link header-logo" to="/profile">
            <div className="logo">USER</div>
          </NavLink>
        </div>
      </header>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
