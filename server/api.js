require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL || 'https://defaultTEST.api.url';
const VOIVODESHIP = process.env.VOIVODESHIP || '1';
const PAGE_SIZE = process.env.PAGE_SIZE || '10';

const getStreet = (city, street = "", page = 1) => 
    `${API_BASE_URL}/streets/?city=${city}&search=${street}&page=${page}`;

const getCity = (city) => 
    `${API_BASE_URL}/cities/?page_size=${PAGE_SIZE}&has_address_points=true&voivodeship=${VOIVODESHIP}&search=${city}`;

const getAddressPoint = (city, street, houseNumber) => 
    `${API_BASE_URL}/address_points/?city=${city}&street=${street}&house_number=${houseNumber}&search="`;

module.exports = { getStreet, getCity, getAddressPoint };

