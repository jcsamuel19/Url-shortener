import React from "react";
import { nanoid } from 'nanoid'
import { getDatabase, child, ref, set, get } from "firebase/database";
import { isWebUri } from 'valid-url';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";


class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            longURL: '', //store long url user inputs
            preferedAlias: '', //store what user inputs for preferedAlias
            generatedURL: '', //store generated new url
            loading: false, //show spinning button if its true
            errors: [], //keep track of what fields have errors
            errorMessage: {}, //keep track of errors
            toolTipMessage: 'Copy To Clip Board' //hover message
        };
    }

    //When the user clicks submit, this will be called
    onSubmit = async (event) => {
        event.preventDefault(); //Prevents the page from reloading when submit is clicked
        this.setState({  
            loading: true, //indicates that the user has clicked sumbit and we are about to start something (Button changes to a spinner)
            generatedURL: '' //set to blank so we don't use an old url
        })

        //Validate the input the user has sumbitted
        var isFormValid = await this.validateInput() 
        if (!isFormValid) { //will generate errors if there are errors in form
            return
        }
        
        //If the user has input a prefered alias then we use it, if not, we generate one
        //Be sure to change minilinkit.com to your domain
        var generatedKey = nanoid(5); //only 5 characters allowed in alias
        var generatedURL = "minilinkit.com/" + generatedKey

        if (this.state.preferedAlias !== '') { //check if user has entered perfered alias
            generatedKey = this.state.preferedAlias //makes generated key to the perfered alias
            generatedURL = "minilinkit.com/" + this.state.preferedAlias //makes generated key to the perfered alias + original link
        }

        //write the contents of the generated url and long url to database
        const db = getDatabase(); //create reference to data base (firebase)
        set(ref(db, '/' + generatedKey), { //call set method, pass reference to db, then the pass we want it to write using generated key
            //pass to db
            generatedKey: generatedKey,
            longURL: this.state.longURL,
            preferedAlias: this.state.preferedAlias,
            generatedURL: generatedURL

        }).then((result) => { //when everything passes 
            this.setState({ 
                generatedURL: generatedURL, //setState from generateURL to generatedURL we created
                loading: false //loads to tell user everthings all good
            })
        }).catch((e) => {//handle error
            
        })
    };

    /* [HELPER METHOD]
    - Checks if feild has an error
    - returns true or false if the key for one of our input feilds is in our errors array
    - meaning: So we can show red for the text field or not    
    */
    hasError = (key) => {
        return this.state.errors.indexOf(key) !== -1; 
    }

    //[HELPER METHOD]
    //when you are inputting content into a text box field 
    handleChange = (e) => { // passes in an event
        const { id, value } = e.target // (event) takes id of field & the value the user types in
        this.setState(prevState => ({ 
            ...prevState,
            [id]: value // id -> longurl
        }))
    }

    //[HELPER METHOD]
    // Goes through form and makes sure everthing is good
    validateInput = async () => {
        var errors = [];
        var errorMessages = this.state.errorMessage

        //Validate Long URL
        if (this.state.longURL.length === 0) { // if user has not inputted any url [length of url is 0]
            errors.push("longURL"); // push error with long url
            errorMessages['longURL'] = 'Please enter your URL!'; // error messege
        } else if (!isWebUri(this.state.longURL)) { // if what they enter is not a proper url
            errors.push("longURL"); // error 
            errorMessages['longURL'] = 'Please a URL in the form of https://www....'; // error messege
        }

        // add a method that makes sure that the url the user enters is shorter than the one created

        //Prefered Alias
        if (this.state.preferedAlias !== '') { // if perfered alias is not blank
            if (this.state.preferedAlias.length > 7) { // check that alias is less than 7 characters
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'Please Enter an Alias less than 7 Characters';
            } else if (this.state.preferedAlias.indexOf(' ') >= 0) { // check for no spaces
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'Spaces are not allowed in URLS';
            }

            var keyExists = await this.checkKeyExists() // check perfered url they put in already exists in our database

            if (keyExists.exists()) {
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'The Alias you have entered already exists! Please enter another one =-)';
            }
        }

        this.setState({ // update state of page
            errors: errors,
            errorMessages: errorMessages,
            loading: false
        });

        if (errors.length > 0) { // if there are errors 
            return false; // goes up to isFormValid then show errors from error page
        }

        return true;
    }

    // checks if a key exists in the database
    checkKeyExists = async () => {
        const dbRef = ref(getDatabase()); // get refernce from DB
        return get(child(dbRef, `/${this.state.preferedAlias}`)).catch((error) => { // fetch record in DB of alias user wants to use
            return false
        });
    }

    copyToClipBoard = () => {
        navigator.clipboard.writeText(this.state.generatedURL)
        this.setState({
            toolTipMessage: 'Copied!'
        })
    }


// ALL HTML CODE
    render() {
        return (
            <div className="container">
                <form autoComplete="off">
                    <h3>URL Shortener</h3>

                    <div className="form-group">
                        <label>Enter Your Long URL</label>
                        <input // input field  
                            id="longURL"
                            onChange={this.handleChange} // if anything changes this means the user is inputting something
                            value={this.state.longURL} // value of url
                            type="url"
                            required
                            className={
                                this.hasError("longURL") // if error array has long url in it
                                    ? "form-control is-invalid" // show form is not valid
                                    : "form-control" // else show form is valid
                            }
                            placeholder="https://www..." 
                        />
                    </div>
                    <div
                        className={ // error message field 
                            this.hasError("longURL") ? "text-danger" : "visually-hidden"
                        }
                    >
                        {this.state.errorMessage.longURL}
                    </div>

                    <div className="form-group">
                        <label htmlFor="basic-url">Your Short URL</label>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">minilinkit.com/</span>
                            </div>
                            <input
                                id="preferedAlias"
                                onChange={this.handleChange}
                                value={this.state.preferedAlias}
                                className={
                                    this.hasError("preferedAlias")
                                        ? "form-control is-invalid"
                                        : "form-control"
                                }
                                type="text" placeholder="eg. 3fwias (Optional)"
                            />
                        </div>
                        <div
                            className={
                                this.hasError("preferedAlias") ? "text-danger" : "visually-hidden"
                            }
                        >
                            {this.state.errorMessage.suggestedAlias}
                        </div>
                    </div>

                    
                    <button className="btn btn-primary" type="button" onClick={this.onSubmit}> 
                        {
                            this.state.loading ? // if state of the button is loading show spinning button
                                <div>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </div>:
                                <div> 
                                    <span className="visually-hidden spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 
                                    <span>Mini Link It</span>
                                </div>
                        } 

                    </button>

                    {       /*[AFTER GERNERATED URL IS CREATED]*/
                        // if there is no generated url on the page we show an empty div 
                        // else show new url but disable typing in text box
                        // overlay Trigger effect on button when hovering over
                        this.state.generatedURL === '' ? 
                            <div></div>
                            :
                            <div className="generatedurl"> 
                                <span>Your NEW URL is: </span>
                                <div className="input-group mb-3">
                                    <input disabled type="text" value={this.state.generatedURL} className="form-control"  placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" /> 
                                    <div className="input-group-append">
                                        <OverlayTrigger
                                            key={'top'}
                                            placement={'top'}
                                            overlay={
                                                <Tooltip id={`tooltip-${'top'}`}>
                                                    {this.state.toolTipMessage}
                                                </Tooltip>
                                            }
                                        >
                                            <button onClick={() => this.copyToClipBoard()} data-toggle="tooltip" data-placement="top" title="Tooltip on top" className="btn btn-outline-secondary" type="button">Copy</button>

                                        </OverlayTrigger>

                                    </div>
                                </div>
                            </div>
                    }

                </form>
            </div>
        );
    }
}

export default Form;

    

    

