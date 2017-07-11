module.exports = {
    person: name => {
        // http://schema.org/Person
        return {
            '@context': 'http://schema.org',
            '@type': 'Person',
            'name': name
        }
    },

    organization: (name, url) => {
        // http://schema.org/Organization
        return {
            '@context': 'http://schema.org',
            '@type' : 'Organization',
            'name': name,
            'url' : url,
            'contactPoint' : [{
                '@type' : 'ContactPoint',
                'telephone' : '+1-401-555-1212',
                'contactType' : 'customer service'
            }]
        }
    }
}
