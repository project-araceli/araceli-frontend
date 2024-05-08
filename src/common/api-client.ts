/**
 * Project: araceli-frontend
 * Created by: Nico Bulut
 * Created at: 08.05.24
 */

import axios from "axios";

export default axios.create({
    baseURL: 'http://localhost:8080'
});