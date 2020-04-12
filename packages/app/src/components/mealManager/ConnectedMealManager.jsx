import React from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import LinearProgress from '@material-ui/core/LinearProgress';
import SearchInput, { createFilter } from 'react-search-input';
import Formsy from 'formsy-react';
import ReactPaginate from 'react-paginate';
import MyFormsyInput from '../helpers/MyInput';
import ConnectedMealOptionsCard from '../mealCard/ConnectedMealOptionsCard';
import MyFormsyTextArea from '../helpers/MyTextArea';
import ProgressLoader from '../helpers/ProgressLoader';
import MealCardContainer from '../mealCard/MealCardContainer';
import Greeting from '../greeting/Greeting';
import { mealActions } from '../../redux/actions';
import ConnectedNav from '../nav/ConnectedNav';
import imageUpload from '../../services/imageUpload';
import '../../../public/styles/search-input.css';
import '../../../public/styles/bookameal.scss';
import '../../../public/styles/modalOpenButton.scss';

ReactModal.setAppElement(document.getElementById('root'));
export class MealManager extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
      showNewMealModal: false,
      defaultImage: 'https://res.cloudinary.com/tovieyeozim/image/upload/' +
      'c_fill,w_200,h_200/v1532706744/hbj4qsguzdi78xcksws8.jpg',
      displayImage: 'https://res.cloudinary.com/tovieyeozim/image/upload/' +
      'c_fill,w_200,h_200/v1532706744/hbj4qsguzdi78xcksws8.jpg',
      searchTerm: '',
      uploading: false,
      uploadPercent: 0,
    };
  }

  componentDidMount() {
    this.props.dispatch(mealActions.getAllMeals());
  }

  setUploadPercent = (percentProgress) => {
    this.setState({ uploadPercent: percentProgress });
  }

  handleImageDrop = (files) => {
    this.setState({ uploading: true });
    imageUpload(files, this.setUploadPercent).then((response) => {
      const { data } = response;
      const fileURL = data.secure_url;
      this.urlInput.props.setValue(fileURL);
      this.setState({
        displayImage: fileURL, uploading: false, uploadPercent: 0
      });

    });
  }

  openNewMealModal = () => {
    this.setState({ showNewMealModal: true });
  }

  closeNewMealModal = () =>
    this.setState({ showNewMealModal: false,
      displayImage: this.state.defaultImage });

  handleCreateMeal = async (meal) => {
    await this.props.dispatch(mealActions.createMeal(meal));
    this.setState({ displayImage: '' });
    this.closeNewMealModal();
    await this.props.dispatch(mealActions.getAllMeals());
  }

  disableButton = () =>
    this.setState({ canSubmit: false });

  enableButton = () =>
    this.setState({ canSubmit: true });

  serverFeedback = error =>
    this.formEl.updateInputsWithError(error);

  searchUpdated = (term) => {
    this.setState({ searchTerm: term });
  }

  handlePaginationClick = (pages) => {
    const { limit } = this.props.pagination;
    const nextOffset = (pages.selected) * limit;
    this.props.dispatch(mealActions.getAllMeals({ limit, offset: nextOffset }));
  }

  render() {
    const KEYS_TO_FILTERS = ['id', 'title', 'description', 'price'];
    const filteredMeals = this.props.meals.length ? this.props.meals
      .filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS)) : [];
    const { isCaterer, firstName } = this.props.user;
    const { pages } = this.props.pagination;

    return (
      <div className="contain">

        <header className="header">
          <ConnectedNav />
        </header>

        <main className="min-height">
          <Greeting isCaterer={isCaterer} firstName={firstName} />
          <div className="title-element flexbox">
            <h5 className="shrink">
              Your Meals
            </h5>

            <button
              className="btn title-button"
              onClick={this.openNewMealModal}
            >
              <p>Add Meal</p>
            </button>

          </div>
          {
          this.props.meals[0] ?

            <React.Fragment>
              <SearchInput
                className="search-input input-field"
                onChange={this.searchUpdated}
              />

              <MealCardContainer
                meals={filteredMeals}
                MealCard={ConnectedMealOptionsCard}
                addClass="scroll2"
                connecting={this.props.connecting}
              />

              <ReactPaginate
                previousLabel="previous"
                nextLabel="next"
                pageCount={pages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePaginationClick}
                containerClassName="pagination"
                subContainerClassName="pages pagination"
                activeClassName="active"
              />

            </React.Fragment>
          :
            <div>
              <h5>
            You have not added any meals.
             Get started by clicking the add a meal button
              </h5>
            </div>
            }

        </main>

        <ReactModal
          isOpen={this.state.showNewMealModal}
          contentLabel="Input Modal"
          className="modal-content"
          onRequestClose={this.closeNewMealModal}
          shouldCloseOnOverlayClick
        >

          <div className="title flexbox navbar-fixed">
            <h4 className="shrink">
              Meal Editor
            </h4>
            <button
              className="btn title-button"
              onClick={this.closeNewMealModal}
            >
                &#10006;
            </button>
          </div>

          <div className="form3-grid">
            <div>
              <Formsy
                className="form3"
                onValidSubmit={this.handleCreateMeal}
                onValid={this.enableButton}
                onInvalid={this.disableButton}
                ref={(form) => { this.formEl = form; }}
              >

                <MyFormsyInput
                  typeOfInput="text"
                  name="title"
                  required
                  placeholder="Meal Title"
                  validations={{ minLength: 1, maxLength: 48 }}
                  validationError="Please enter the meal title"
                  validationErrors={{
                minLength: 'input must be longer than 1 character',
                maxLength: 'input must be shorter than 50 characters',
              }}
                />
                <MyFormsyInput
                  typeOfInput="number"
                  name="price"
                  required
                  placeholder="Price"
                  validations={{
                  isOnlyInt: (values, value = '') =>
                  /^(\s?|[1-9]\d*)$/.test(value),
                  minLength: 1,
                  maxLength: 48
                }}
                  validationError="Please enter a price"
                  validationErrors={{
                isOnlyInt: 'price must be integer',
                minLength: 'input must be longer than 1 character',
                maxLength: 'input must be shorter than 50 characters',
              }}
                />
                <MyFormsyTextArea
                  name="description"
                  required
                  placeholder="Description"
                  validations={{ minLength: 5, maxLength: 98 }}
                  validationErrors={{
                minLength: 'input must be longer than 5 characters',
                maxLength: 'input must be shorter than 100 characters',
              }}
                />

                <MyFormsyInput
                  innerRef={(c) => { this.urlInput = c; }}
                  style={{ visibility: 'hidden', height: 0, margin: 0 }}
                  required
                  typeOfInput="url"
                  name="imageUrl"
                  value={this.state.defaultImage}
                  validations={{ isUrl: true, minLength: 5, maxLength: 148 }}
                  validationError="Please select an image"
                  validationErrors={{
                isUrl: 'A valid url was not supplied',
                minLength: 'input must be longer than 5 characters',
                maxLength: 'input must be shorter than 150 characters',
              }}
                />
              </Formsy>
            </div>

            <div className="overlay-container">

              <div className="overlay full" >
                <Dropzone
                  onDrop={this.handleImageDrop}
                  multiple
                  accept="image/*"
                  className="dropzone"
                >
                  {!this.state.uploading &&
                  <button className="btn"> Select an Image</button>}
                </Dropzone>

              </div>

              <div id="meal_image">
                {this.state.displayImage ?
                 !this.state.uploading &&
                 <img
                   src={this.state.displayImage}
                   alt="meal"
                   className="fluid-img"
                 />
              : !this.state.uploading &&
                <div
                  style={{ display: 'flex', alignItems: 'center' }}
                  className="dropzone"
                >
                  <button className="btn"> Select an Image</button>
                </div>}
                {this.state.uploading &&
                <ProgressLoader upload={this.state.uploadPercent} />
                  }
              </div>
            </div>

            { !this.props.connecting &&
            <button
              className={this.state.canSubmit
              ? 'btn' : 'btn btn-disabled'}
              onClick={() => this.formEl.submit()}
              type="submit"
              disabled={!this.state.canSubmit}
            >
              <p>Continue</p>
            </button>}

            {this.props.connecting &&
            <LinearProgress
              style={{ height: '10px' }}
            />
            }

          </div>

        </ReactModal>

      </div>
    );
  }
}

MealManager.defaultProps = {
  connecting: false,
  meals: [],
  pagination: {
    pages: 1,
    count: 1,
    limit: 8
  }
};

MealManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
  connecting: PropTypes.bool,
  pagination: PropTypes.shape({
    pages: PropTypes.number,
    count: PropTypes.number,
    limit: PropTypes.number,
  }),
  user: PropTypes.shape({
    isCaterer: PropTypes.bool,
    firstName: PropTypes.string
  }).isRequired,
  meals: PropTypes.arrayOf(PropTypes.object),
};

export const mapStateToProps = state =>
  ({
    authenticated: state.loginReducer.authenticated,
    user: state.loginReducer.user,
    mealError: state.mealsReducer.mealError,
    pagination: state.mealsReducer.pagination,
    connecting: state.mealsReducer.connecting,
    meals: state.mealsReducer.meals, });

export default connect(mapStateToProps)(MealManager);
