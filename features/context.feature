Feature: Context
  In order to have a clean and familiar declarative syntax
  for consuming multiple values from the same context
  As a developer
  I want suspense-service to export a Context API

  Background:
    Given a context named "Context" with the default value "default"
    And a component named "Component" using the context "Context" and returning a "div"
    And a function named "render" returning a "span"

  Rule: Compatibility with React Context API
    Example: Consume default value
      Given I declare a "Context" consumer named "app" with the props
        | children | render |
      When I render "app" to static markup
      Then it should output
        """
        <span>default</span>
        """

    Example: Consume provided value
      Given I declare a "Context" consumer named "consumer" with the props
        | children | render |
      And I declare a "Context" provider named "app" with the props
        | value    | "provided" |
        | children | consumer   |
      When I render "app" to static markup
      Then it should output
        """
        <span>provided</span>
        """

    Example: Consume value with hook
      Given I declare a "Component" element named "consumer" without props
      And I declare a "Context" provider named "app" with the props
        | value    | "hook"   |
        | children | consumer |
      When I render "app" to static markup
      Then it should output
        """
        <div>hook</div>
        """

  Rule: Support keyed values
    Example: Consume from the closest provider
      Given I declare a "Context" consumer named "consumer" with the props
        | id       | null   |
        | children | render |
      And I declare a "Context" provider named "provider" with the props
        | value    | "inner"  |
        | id       | "b"      |
        | children | consumer |
      And I declare a "Component" element named "component" with the props
        | id | null |
      And I declare a "Context" provider named "app" with the props
        | value    | "outer"               |
        | id       | "a"                   |
        | children | [component, provider] |
      When I render "app" to static markup
      Then it should output
        """
        <div>outer</div><span>inner</span>
        """

    Example: Consume provider by id
      Given I declare a "Component" element named "component" with the props
        | id | "b" |
      And I declare a "Context" consumer named "consumer" with the props
        | id       | "a"    |
        | children | render |
      And I declare a "Context" provider named "provider" with the props
        | value    | "inner"               |
        | id       | "b"                   |
        | children | [consumer, component] |
      And I declare a "Context" provider named "app" with the props
        | value    | "outer"  |
        | id       | "a"      |
        | children | provider |
      When I render "app" to static markup
      Then it should output
        """
        <span>outer</span><div>inner</div>
        """
