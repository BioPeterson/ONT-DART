/**
 * Copyright 2022, The Johns Hopkins University Applied Physics Laboratory LLC
 * All rights reserved.
 * Distributed under the terms of the BSD 3-Clause License.
 */
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#3F51B5',
                secondary: '#9FA8DA'
            }
        }
    }
});
