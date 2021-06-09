import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import Mutations from "../../graphql/mutations";
import Queries from "../../graphql/queries";

const { NEW_PLAYLIST } = Mutations;
const { CURRENT_USER } = Queries;


class PlaylistCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  handleSubmit(e, newPlaylist, currentUser) {
    e.preventDefault();
    let title = this.state.title;
    newPlaylist({
      variables: {
        user: currentUser,
        title: title,
        description: this.state.description
      }
    }).then(() => this.props.closeModal());
  }

  render() {
    let { closeModal } = this.props;

    return (       
      <Query query={CURRENT_USER}>
        {({ loading, error, data }) => {
          if (loading) return <option>Loading...</option>;
          if (error) return <option>{error}</option>;
          const {currentUser} = data;

          return (
            <Mutation mutation={NEW_PLAYLIST}>
              {(newPlaylist) => (
              <div>
                <form onSubmit={e => this.handleSubmit(e, newPlaylist, currentUser)}>
                <div className="modal-container">
                  <h1 id="new-playlist-header">Новый плейлист</h1>
                  <div className="new-playlist-input-container">
                    <div className="new-playlist-input-box">
                      <div className="new-playlist-content-spacing">
                        <input
                          type="text"
                          onChange={this.update("title")}
                          className="new-playlist-inputBox-input"
                          value={this.state.title}
                          placeholder="Введите название плейлиста"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-buttons">
                    <button className="modal-button-cancel" onClick={closeModal}>
                      Отмена
                    </button>
                    <button className="modal-button-create" type="submit">
                      Добавить
                    </button>
                  </div>
                </div>
              </form>
            </div>
            )}
          </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default PlaylistCreate;
