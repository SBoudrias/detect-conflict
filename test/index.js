'use strict';

var assert = require('assert');
var fs = require('fs');
var os = require('os');
var path = require('path');
var conflict = require('..');

var logoPath = path.join(__dirname, 'fixtures/yeoman-logo.png');
var standingPath = path.join(__dirname, 'fixtures/yeoman-standing.png');

describe('Conflicter', function () {
  it('raise conflict on directory', function () {
    assert.equal(true, conflict(__dirname));
  });

  it('does not raise conflict on unexisting file', function () {
    assert.equal(false, conflict('whatever-file.unexistent', 'foo'));
  });

  it('raise conflict on file with different contents', function () {
    assert.equal(true, conflict(__filename, 'foo'));
  });

  it('does not raise conflict if file contents is the same (as Buffer)', function () {
    assert.equal(false, conflict(__filename, fs.readFileSync(__filename)));
  });

  it('does not raise conflict if file contents is the same (as String)', function () {
    assert.equal(false, conflict(__filename, fs.readFileSync(__filename, 'utf8')));
  });

  describe('with binary files', function () {
    it('raise conflict on file with different contents', function () {
      assert.equal(true, conflict(logoPath, fs.readFileSync(standingPath)));
    });

    it('raise conflict on file with different file type', function () {
      assert.equal(true, conflict(logoPath, 'new content'));
    });

    it('does not raise conflict if file contents is the same', function () {
      assert.equal(false, conflict(logoPath, fs.readFileSync(logoPath)));
    });

    it('does not raise conflict if file contents is the same with different utime', function (done) {
      var newPath = path.join(os.tmpdir(), 'tmp-logo.png');
      fs.createReadStream(logoPath)
        .pipe(fs.createWriteStream(newPath))
        .on('finish', function () {
          assert.equal(false, conflict(logoPath, fs.readFileSync(newPath)));
          fs.unlink(newPath, done);
        });
    });
  });
});
