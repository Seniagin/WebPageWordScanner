import styled, { css, keyframes } from "styled-components";

const hangAndFallAnimation = keyframes`
  0% {
    transform:  rotate(0deg);
    transform-origin: top left;
  }
  25% {
    transform: rotate(90deg);
    transform-origin: top left;
  }
  50% {
    transform: rotate(90deg);
    transform-origin: top left;
  }
  100% {
    transform: translateY(100vh);
    transform-origin: top left; 
  }
`;

export const StyledLogoWrapper = styled.div<{ fail?: boolean }>`
  animation: ${({ fail }) =>
        fail
            ? css`
          ${hangAndFallAnimation} 1s ease-in-out forwards
        `
            : 'none'};`

export const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  `;

export const StyledInput = styled.input`
    width: 400px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-bottom: 20px;
    padding-left: 10px;
    font-size: 16px;
`;

export const StyledSearchButton = styled.button`
    width: 100px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-bottom: 20px;
    padding-left: 10px;
    font-size: 16px;
    &:hover {
        cursor: pointer;
        border: 1px solid #000;
    }
`;

export const StyledSearchResultsContainer = styled.div`
    width: 700px;
    /* height: 400px; */
    border-radius: 5px;
    border: 1px solid #ccc;
    padding: 10px;
    overflow: auto;
`;

export const StyledSearchResult = styled.div`
    padding: 10px;
    border-bottom: 1px solid #ccc;
    &:last-child {
        border-bottom: none;
    }
`;

export const StyledSearchResultLink = styled.a`
    color: #000;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

export const StyledSearchResultText = styled.div`
    font-size: 14px;
    color: #666;
    margin-top: 5px;
`;

export const StyledLoading = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 4px solid #ccc;
    border-top-color: #000;
    animation: spin 1s infinite linear;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;