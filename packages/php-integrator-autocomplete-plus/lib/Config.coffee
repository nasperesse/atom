
module.exports =

##*
# Abstract base class for managing configurations.
##
class Config
    ###*
     * Raw configuration object.
    ###
    data: null

    ###*
     * Array of change listeners.
    ###
    listeners: null

    ###*
     * Constructor.
    ###
    constructor: () ->
        @listeners = {}

        @data =
            disableBuiltinAutocompletion   : true
            insertNewlinesForUseStatements : false
            automaticallyAddUseStatements  : true
            enablePhpunitAnnotationTags    : true
            largeListRefreshTimeout        : 5000
            largeListRefreshTimeoutJitter  : 3000

            # See also http://www.phpdoc.org/docs/latest/index.html .
            phpdoc_base_url : {
                prefix: 'http://www.phpdoc.org/docs/latest/references/phpdoc/tags/'
                suffix: '.html'
            }

            # See also https://phpunit.de/manual/current/en/index.html .
            phpunit_annotations_base_url : {
                prefix: 'https://phpunit.de/manual/current/en/appendixes.annotations.html'
                id_prefix: '#appendixes.annotations.'
            }

            # See also https://secure.php.net/urlhowto.php .
            php_documentation_base_urls : {
                classes   : 'https://secure.php.net/class.'
                functions : 'https://secure.php.net/function.'
                keywords  : 'https://secure.php.net/manual/en/reserved.php'
            }

        @load()

    ###*
     * Loads the configuration.
    ###
    load: () ->
        throw new Error("This method is abstract and must be implemented!")

    ###*
     * Registers a listener that is invoked when the specified property is changed.
    ###
    onDidChange: (name, callback) ->
        if name not of @listeners
            @listeners[name] = []

        @listeners[name].push(callback)

    ###*
     * Retrieves the config setting with the specified name.
     *
     * @return {mixed}
    ###
    get: (name) ->
        return @data[name]

    ###*
     * Retrieves the config setting with the specified name.
     *
     * @param {string} name
     * @param {mixed}  value
    ###
    set: (name, value) ->
        @data[name] = value

        if name of @listeners
            for listener in @listeners[name]
                listener(value, name)
