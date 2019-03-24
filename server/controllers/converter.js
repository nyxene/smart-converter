const TextToPng = require('../controllers/textToPng');

const POST_MAX_LENGTH = 2200;

class Converter {
    constructor({
        postMaxLength: postMaxLength = POST_MAX_LENGTH,
        textColor = '',
        bgColor = ''
    } = {}) {
        this.postMaxLength = postMaxLength;
        this.textColor = textColor;
        this.bgColor = bgColor;
    }

    run(originalPost) {
        try {
            const { post, otherText } = this.preparePost(originalPost);
            const t2p = new TextToPng({
                textColor: this.textColor,
                bgColor: this.bgColor
            });
            const images = t2p.render(otherText);

            return { post, images };
        } catch (e) {
            throw new Error(e);
        }
    }

    preparePost(originalPost) {
        if (!originalPost || typeof originalPost !== 'string') {
            throw new Error('Error when prepare post. Post is empty or not string');
        }

        const post = originalPost.trim();

        return {
            post: post.substring(0, this.postMaxLength),
            otherText: post.substring(this.postMaxLength)
        };
    }
}

module.exports = Converter;
