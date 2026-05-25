function Search({ searchKey, setSearchKey }) {
    return (
        <div className="user-search-area">
            <input
                className="user-search-text"
                //redundant?
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
            ></input>
            <i className="fa fa-search user-search-btn" aria-hidden="true"></i>
        </div>
    );
}
export default Search;
