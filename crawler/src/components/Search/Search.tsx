import { useState } from "react";
import imgUrl from '../../assets/logo.png'

import { StyledInput, StyledLayout, StyledLoading, StyledLogoWrapper, StyledSearchButton, StyledSearchResult, StyledSearchResultLink, StyledSearchResultText, StyledSearchResultsContainer } from "./styles";
import { searchForWordInSite } from "./service";
import React from "react";

function mapCrawlResultsToSearchResults(crawlResults: Record<string, string>, searchWord: string) {
    const results = [];
    for (const site in crawlResults) {
        const text = replaceSearchWordWithBold(searchWord, crawlResults[site]);
        results.push({ site, text });
    }
    return results;
}

function replaceSearchWordWithBold(word: string, text: string) {
    return text.replace(new RegExp(word, 'g'), `<b>${word}</b>`);
}

export function Search() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | unknown>(null)
    const [searchResults, setSearchResults] = useState<{ site: string, text: string }[]>([]);
    const siteRef = React.useRef<HTMLInputElement>(null);
    const wordRef = React.useRef<HTMLInputElement>(null);
    const depthRef = React.useRef<HTMLInputElement>(null);

    function handleSearch() {

        const searchWord = wordRef.current?.value;
        const searchSite = siteRef.current?.value;
        const depth = depthRef.current?.value as unknown as number;
        if (!searchWord || !searchSite) {
            return;
        }
        setError(null);
        setLoading(true);
        searchForWordInSite(searchSite, searchWord, depth)
            .then(({ err, data }) => {
                setLoading(false);

                if (err) {
                    console.error(err);
                    setError(true);
                    return;
                }

                const crawledResults = data?.crawlResults as unknown as Record<string, string>;
                const results = mapCrawlResultsToSearchResults(crawledResults, searchWord);

                setSearchResults(results);
            });
    }

    return (
        <StyledLayout>
            <StyledLogoWrapper fail={!!error}>
                <img src={imgUrl} alt="logo" width="400" height="150" />
            </StyledLogoWrapper>
            {!!error && <h3>Something went wrong, try again, maybe it will fix the problem</h3>}
            <StyledInput type="text" ref={siteRef} placeholder="Site" defaultValue={"https://www.nbcnews.com/news/us-news/faa-recommends-door-plug-inspections-boeing-model-midair-alaska-blowou-rcna134986"} />
            <StyledInput type="text" ref={wordRef} placeholder="Word" defaultValue={"Alaska Airlines"} />
            <span>Depth (how deep we'll search on site, the bigger depth - the higher chance to fail):</span>
            <StyledInput type="number" ref={depthRef} placeholder="Depth" defaultValue={0} min={0} max={2} />
            <StyledSearchButton onClick={handleSearch}>Search</StyledSearchButton>
            {loading && <StyledLoading />}
            {searchResults.length > 0 && (
                <>
                    <h3>Results count: {searchResults.length}</h3>
                    <StyledSearchResultsContainer>
                        {searchResults.map(({ site, text }) => (
                            <StyledSearchResult key={site}>
                                <StyledSearchResultLink href={site}>{site}</StyledSearchResultLink>
                                <StyledSearchResultText dangerouslySetInnerHTML={{ __html: text }}></StyledSearchResultText>
                            </StyledSearchResult>
                        ))}
                    </StyledSearchResultsContainer>
                </>
            )}
        </StyledLayout>
    )
}