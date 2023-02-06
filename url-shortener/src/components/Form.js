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

}

    

    

