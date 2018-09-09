/*globals CONFIG */

(function () {
    'use strict';

    function Terrain(state) {
        this.game = state.game;
        this.state = state;
        this.sizeX = null;
        this.sizeY = null;
        this.terrain = [];
    }

    Terrain.prototype.constructor = Terrain;

    Terrain.prototype = {
        generateTerrain: function() {
            this.sizeX = CONFIG.WORLD_WIDTH + 1;
            this.sizeY = CONFIG.WORLD_HEIGHT + 1;

            var i, j;

            var TILE = {
                PALLET: 6,
                ROAD: 6 + 15 * 1,
                BLANK: 6 + 15 * 2,
                FORKLIFT: 6 + 15 * 3
            };

            var TILESTACK = [TILE.PALLET, TILE.ROAD, TILE.BLANK, TILE.FORKLIFT];

            for (i = 0; i < this.sizeX; i++) {
                this.terrain[i] = [];
                for (j = 0; j < this.sizeY; j++) {
                    this.terrain[i][j] = this.game.rnd.between(0, 99999);
                }
            }

            this.generateTerrainAverage();

            this.generateTerrainConvertToTileNumber(TILE);

            this.generateTerrainSmoothing(TILESTACK);

            return this.generateTerrainTransition(TILESTACK);
        },

        generateTerrainAverage: function () {
            var i, j, k;
            for (k = 0; k < 2; k++) {
                for (i = 0; i < this.sizeX - 1; i++) {
                    for (j = 0; j < this.sizeY - 1; j++) {
                        this.terrain[i][j] = (this.terrain[i][j] +
                            this.terrain[i + 1][j] +
                            this.terrain[i][j + 1] +
                            this.terrain[i + 1][j + 1]
                        ) / 4;

                        this.terrain[i][j] = (
                            this.terrain[(this.sizeX - 1) - i][(this.sizeY - 1) - j] +
                            this.terrain[(this.sizeX - 1) - i - 1][(this.sizeY - 1) - j] +
                            this.terrain[(this.sizeX - 1) - i][(this.sizeY - 1) - j - 1] +
                            this.terrain[(this.sizeX - 1) - i - 1][(this.sizeY - 1) - j - 1]
                        ) / 4;
                    }
                }
            }
            return this.terrain;
        },

        generateTerrainConvertToTileNumber: function (TILE) {
            var i, j;
            for (i = 0; i < this.sizeX; i++) {
                for (j = 0; j < this.sizeY; j++) {

                    var data = this.terrain[i][j],
                        val;

                    if (data > 58000) {
                        val = TILE.PALLET;
                    } else if (data > 50000) {
                        val = TILE.ROAD;
                    } else if (data > 38000) {
                        val = TILE.BLANK;
                    } else {
                        val = TILE.FORKLIFT;
                    }
                    this.terrain[i][j] = val;
                }
            }
            return this.terrain;
        },
        generateTerrainSmoothing: function (TILESTACK) {
            var i, j;
            for (var n = 0; n < TILESTACK.length - 1; n++) {
                var tileCurrent = TILESTACK[n], tileAbove = -1, tileBelow = -1;

                if (n > 0) {
                    tileAbove = TILESTACK[n - 1];
                }

                tileBelow = TILESTACK[n + 1];

                for (i = 0; i < this.sizeX; i++) {
                    for (j = 0; j < this.sizeY; j++) {
                        if (this.terrain[i][j] === tileCurrent) {
                            if (i > 0 &&
                                j > 0 &&
                                this.terrain[i - 1][j - 1] !== tileCurrent &&
                                this.terrain[i - 1][j - 1] !== tileAbove &&
                                this.terrain[i - 1][j - 1] !== tileBelow) {
                                this.terrain[i - 1][j - 1] = tileBelow;
                            }
                            if (j > 0 &&
                                this.terrain[i][j - 1] !== tileCurrent &&
                                this.terrain[i][j - 1] !== tileAbove &&
                                this.terrain[i][j - 1] !== tileBelow) {
                                this.terrain[i][j - 1] = tileBelow;
                            }
                            if (i < this.sizeX - 1 &&
                                j > 0 &&
                                this.terrain[i + 1][j - 1] !== tileCurrent &&
                                this.terrain[i + 1][j - 1] !== tileAbove &&
                                this.terrain[i + 1][j - 1] !== tileBelow) {
                                this.terrain[i + 1][j - 1] = tileBelow;
                            }
                            if (i < this.sizeX - 1 &&
                                this.terrain[i + 1][j] !== tileCurrent &&
                                this.terrain[i + 1][j] !== tileAbove &&
                                this.terrain[i + 1][j] !== tileBelow) {
                                this.terrain[i + 1][j] = tileBelow;
                            }
                            if (i < this.sizeX - 1 &&
                                j < this.sizeY - 1 &&
                                this.terrain[i + 1][j + 1] !== tileCurrent &&
                                this.terrain[i + 1][j + 1] !== tileAbove &&
                                this.terrain[i + 1][j + 1] !== tileBelow) {
                                this.terrain[i + 1][j + 1] = tileBelow;
                            }
                            if (j < this.sizeY - 1 &&
                                this.terrain[i][j + 1] !== tileCurrent &&
                                this.terrain[i][j + 1] !== tileAbove &&
                                this.terrain[i][j + 1] !== tileBelow) {
                                this.terrain[i][j + 1] = tileBelow;
                            }
                            if (i > 0 &&
                                j < this.sizeY - 1 &&
                                this.terrain[i - 1][j + 1] !== tileCurrent &&
                                this.terrain[i - 1][j + 1] !== tileAbove &&
                                this.terrain[i - 1][j + 1] !== tileBelow) {
                                this.terrain[i - 1][j + 1] = tileBelow;
                            }
                            if (i > 0 &&
                                this.terrain[i - 1][j] !== tileCurrent &&
                                this.terrain[i - 1][j] !== tileAbove &&
                                this.terrain[i - 1][j] !== tileBelow) {
                                this.terrain[i - 1][j] = tileBelow;
                            }
                        }
                    }
                }
            }
            return this.terrain;
        },
        generateTerrainTransition: function (TILESTACK) {
            var i, j, n;
            var terrainFinal = [];

            for (i = 0; i < this.sizeX - 1; i++) {
                var row = [];
                for (j = 0; j < this.sizeY - 1; j++) {
                    row[j] = 50;
                }
                terrainFinal[i] = row;
            }

            for (n = 1; n < TILESTACK.length; n++) {
                var thisLayer = TILESTACK[n],
                    upperLayer = TILESTACK[n - 1];

                for (i = 0; i < this.sizeX - 1; i++) {
                    for (j = 0; j < this.sizeY - 1; j++) {

                        var q = [[this.terrain[i][j], this.terrain[i + 1][j]],
                        [this.terrain[i][j + 1], this.terrain[i + 1][j + 1]]];

                        if (q.join() === [[upperLayer, upperLayer], [upperLayer, upperLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 6;
                        } else if (q.join() === [[upperLayer, upperLayer], [upperLayer, thisLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 9;
                        } else if (q.join() === [[upperLayer, upperLayer], [thisLayer, upperLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 8;
                        } else if (q.join() === [[thisLayer, upperLayer], [upperLayer, upperLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 3;
                        } else if (q.join() === [[upperLayer, thisLayer], [upperLayer, upperLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 4;
                        } else if (q.join() === [[upperLayer, upperLayer], [thisLayer, thisLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 11;
                        } else if (q.join() === [[thisLayer, upperLayer], [thisLayer, upperLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 5;
                        } else if (q.join() === [[thisLayer, thisLayer], [upperLayer, upperLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 1;
                        } else if (q.join() === [[upperLayer, thisLayer], [upperLayer, thisLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 7;
                        } else if (q.join() === [[thisLayer, upperLayer], [upperLayer, thisLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 14;
                        } else if (q.join() === [[upperLayer, thisLayer], [thisLayer, upperLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 13;
                        } else if (q.join() === [[upperLayer, thisLayer], [thisLayer, thisLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 12;
                        } else if (q.join() === [[thisLayer, upperLayer], [thisLayer, thisLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 10;
                        } else if (q.join() === [[thisLayer, thisLayer], [thisLayer, upperLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 0;
                        } else if (q.join() === [[thisLayer, thisLayer], [upperLayer, thisLayer]].join()) {
                            terrainFinal[i][j] = (n - 1) * 15 + 2;
                        } else if (q.join() === [[thisLayer, thisLayer], [thisLayer, thisLayer]].join()) {
                            terrainFinal[i][j] = n * 15 + 6;
                        }
                    }
                }
            }
            return terrainFinal;
        }
    };

    window['catathonic'] = window['catathonic'] || {};
    window['catathonic'].Terrain = Terrain;
}());
