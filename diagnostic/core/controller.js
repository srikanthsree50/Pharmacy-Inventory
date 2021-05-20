const express = require('express');
const uuid = require('uuid4');
const mongoose = require('mongoose');
const DiagnosticsSchema = require('./schema');
const Diagnostics = mongoose.model('Diagnostics', DiagnosticsSchema);