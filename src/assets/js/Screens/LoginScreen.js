import React from "react";
import {withRouter} from "react-router-dom";
import AppContext from "../Decorators/AppContext";
import BaseScreen from "./BaseScreen";
import Screen from "../Components/Screen";
import Request from "../app/Request";
import Validator from "../../../common/Validator/index";
import config from "../../../common/config";

@AppContext
@withRouter
export default class LoginScreen extends BaseScreen {
    state = {
        formType: 'login',
        errors: [],
        data: {
            name: '',
            password: '',
            passwordConfirm: ''
        }
    };

    handleSubmit = async event => {
        event.preventDefault();

        const {formType, data} = this.state;
        const validation = Validator.validate(data, config.validators[formType](data));

        if (!validation.passed) {
            this.setState({errors: validation.getErrors()});
            return;
        }

        await this.setState({errors: []});
        const res = await Request.post(`/api/${formType}`, this.state.data);

        if (!res.success) {
            this.setState({errors: res.errors});
            return;
        }

        this.props.context.connect(res.body.data);
        await this.setState({errors: []});
    };

    handleChange = event => {
        const {data} = this.state;
        data[event.target.name] = event.target.value;
        this.setState({data});
    };

    toggleRegistrationForm = () => {
        this.setState({formType: this.state.formType === 'register' ? 'login' : 'register', errors: []});
    };

    render() {
        return (
            <Screen name="LoginScreen">
                <form
                    onSubmit={this.handleSubmit}
                    className={`LoginScreen__form LoginScreen__form--${this.state.formType}`}
                >
                    {this.state.errors.length > 0 && (
                        <div className="LoginScreen__errors">
                            {this.state.errors.map((error, index) => (
                                <div key={index} className="LoginScreen__errors-error">
                                    {error}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="LoginScreen__form-field">
                        <label htmlFor="name">Name</label>
                        <input
                            maxLength={15}
                            type="text"
                            name="name"
                            id="name"
                            autoFocus
                            autoComplete="current-username"
                            tabIndex={1}
                            value={this.state.data.name}
                            onChange={this.handleChange}
                        />
                    </div>

                    <div className="LoginScreen__form-field">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="current-password"
                            tabIndex={2}
                            value={this.state.data.password}
                            onChange={this.handleChange}
                        />
                    </div>

                    {this.state.formType ==='register' && (
                        <div className="LoginScreen__form-field">
                            <label htmlFor="passwordConfirm">Confirm Password</label>
                            <input
                                type="password"
                                name="passwordConfirm"
                                id="passwordConfirm"
                                autoComplete="new-password"
                                tabIndex={3}
                                value={this.state.data.passwordConfirm}
                                onChange={this.handleChange}
                            />
                        </div>
                    )}

                    <div className="LoginScreen__form-actions">
                        <button type="button" onClick={this.toggleRegistrationForm}>
                            {this.state.formType ==='register' ? 'Back' : 'New Account'}
                        </button>
                        <button type="submit">
                            {this.state.formType ==='register' ? 'Register' : 'Login'}
                        </button>
                    </div>
                </form>
            </Screen>
        );
    }
}
