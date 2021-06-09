import React from "react";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import Queries from "../../graphql/queries";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const { FETCH_PLAYLISTS, CURRENT_USER } = Queries;

const OPEN_MODAL_MUTATION = gql`
  mutation {
    openNewPlaylistModalMutation @client
  }
`;

class NavBar extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="SideBar">
        <div className="SideBar-Logo">
        </div>
        <div className="User-Nav">
          <div className="nav-home">
            <Link to="/" className="home-link">
              Главная
            </Link>
          </div>
          <div className="nav-search">
            <Link to="/search" className="search-link">
              Поиск
            </Link>
          </div>
          <div className="nav-library">
            <Link to="/library/playlists" className="library-link">
              Плейлисты
            </Link>
          </div>
          <div className="nav-favorites">
            <Link to="/favorites" className="favorites-link">
              Понравившиеся
            </Link>
          </div>
        </div>

        <div className="User-Playlists">

          <div className="nav-playlist-title">Мои плейлисты</div>
          <div className="create-playlist">
            <Mutation mutation={OPEN_MODAL_MUTATION}>
              {openNewPlaylistModalMutation => (
                <div
                  className="create-playlist-title"
                  onClick={openNewPlaylistModalMutation}
                >
                  Создать плейлист +
                </div>
              )}
            </Mutation>
          </div>
          <div className="playlists">
            <Query query={Queries.CURRENT_USER}>
              {({ loading, error, data }) => {
                if (loading) return <option>Loading...</option>;
                if (error) return <option>{error}</option>;
                if (data) {
                const { currentUser } = data;
                return (
                  <Query query={FETCH_PLAYLISTS} pollInterval={200}>
                    {({ loading, error, data }) => {
                      if (loading) return <p>Loading...</p>;
                      if (error) return <p>Error</p>;
                      return data.playlists.map(({ _id, title, user }) => {
                        if (user._id === currentUser) {
                          return (
                            <Link key={_id} to={`/playlists/${_id}`}>
                              <div key={title} className="playlist-item">
                                {title}
                              </div>
                            </Link>
                          )
                        }
                      });
                    }}
                  </Query>
                )
                } else {
                  return null;
                }
              }}
            </Query>
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;