import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import firebase from 'firebase'
import 'firebase/firestore'
// import { composeWithDevTools } from 'redux-devtools-extension';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import { reduxFirestore, firestoreReducer } from 'redux-firestore'
import notifyReducer from './reducers/notifyReducer'
import settingsReducer from './reducers/settingsReducer'

// @todo destructure process.env vars
// const {
//   API_KEY,
//  ... 
// } = process.env

const API_KEY = process.env.REACT_APP_API_KEY
const AUTH_DOMAINN = process.env.REACT_APP_AUTH_DOMAINN
const DATABASE_URL = process.env.REACT_APP_DATABASE_URL
const PROJECT_ID = process.env.REACT_APP_PROJECT_ID
const STORAGE_BUCKET = process.env.REACT_APP_STORAGE_BUCKET
const MESSAGING_SENDER_ID = process.env.REACT_APP_MESSAGING_SENDER_ID

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAINN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID
}

// react-redux firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}

// init firebase instance
firebase.initializeApp(firebaseConfig)
// init firestore
const firestore = firebase.firestore()
firestore.settings({
  timestampsInSnapshots: true,
});


// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase) // <- needed if using firestore
)(createStore)


// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
  notify: notifyReducer,
  settings: settingsReducer
})

// check for settings in localStorage
if (localStorage.getItem("settings") === null) {
  // default settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false  
  } 

  // set to localStorage
  localStorage.setItem("settings", JSON.stringify(defaultSettings))
}


// create initial state
const initialState = { settings: JSON.parse(localStorage.getItem("settings")) }

// create store
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  // compose(
  //   reactReduxFirebase(firebase),
  //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  // )
)

export default store